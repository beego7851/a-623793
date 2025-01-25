import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentReceiptRequest {
  paymentId: string;
  memberNumber: string;
  memberName: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  collectorName: string;
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const generateReceiptEmail = ({
  receiptNumber,
  memberName,
  memberNumber,
  amount,
  paymentType,
  paymentMethod,
  collectorName,
}: {
  receiptNumber: string;
  memberName: string;
  memberNumber: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  collectorName: string;
}) => {
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          .receipt-number {
            color: #2563eb;
            font-size: 1.2em;
            margin-bottom: 20px;
          }
          .details {
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            border-bottom: 1px solid #e2e8f0;
            padding: 5px 0;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.9em;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PWA Burton</h1>
          <h2>Payment Receipt</h2>
        </div>
        
        <div class="receipt-number">
          Receipt Number: ${receiptNumber}
        </div>

        <div class="details">
          <div class="detail-row">
            <strong>Date:</strong>
            <span>${new Date().toLocaleDateString('en-GB')}</span>
          </div>
          <div class="detail-row">
            <strong>Member Name:</strong>
            <span>${memberName}</span>
          </div>
          <div class="detail-row">
            <strong>Member Number:</strong>
            <span>${memberNumber}</span>
          </div>
          <div class="detail-row">
            <strong>Amount Paid:</strong>
            <span>${formattedAmount}</span>
          </div>
          <div class="detail-row">
            <strong>Payment Type:</strong>
            <span>${paymentType}</span>
          </div>
          <div class="detail-row">
            <strong>Payment Method:</strong>
            <span>${paymentMethod}</span>
          </div>
          <div class="detail-row">
            <strong>Collector:</strong>
            <span>${collectorName}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your payment. Please keep this receipt for your records.</p>
          <p>If you have any questions, please contact your collector or PWA Burton administration.</p>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Payment receipt function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paymentRequest: PaymentReceiptRequest = await req.json();
    console.log("Processing payment receipt for:", {
      memberNumber: paymentRequest.memberNumber,
      amount: paymentRequest.amount,
      timestamp: new Date().toISOString(),
    });

    // Generate receipt number
    const receiptNumber = `REC${Date.now()}`;

    // Get member email
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('email')
      .eq('member_number', paymentRequest.memberNumber)
      .single();

    if (memberError || !memberData?.email) {
      console.error("Error getting member email:", memberError);
      throw new Error("Failed to get member email");
    }

    // Create receipt record
    const { data: receipt, error: insertError } = await supabase
      .from('payment_receipts')
      .insert({
        payment_id: paymentRequest.paymentId,
        receipt_number: receiptNumber,
        sent_to: memberData.email,
        amount: paymentRequest.amount,
        payment_type: paymentRequest.paymentType,
        payment_method: paymentRequest.paymentMethod,
        collector_name: paymentRequest.collectorName,
        member_number: paymentRequest.memberNumber,
        member_name: paymentRequest.memberName
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating receipt record:", insertError);
      throw new Error("Failed to create receipt record");
    }

    // Generate email HTML
    const emailHtml = generateReceiptEmail({
      receiptNumber,
      memberName: paymentRequest.memberName,
      memberNumber: paymentRequest.memberNumber,
      amount: paymentRequest.amount,
      paymentType: paymentRequest.paymentType,
      paymentMethod: paymentRequest.paymentMethod,
      collectorName: paymentRequest.collectorName
    });

    // For testing, send to burtonpwa@gmail.com instead of member's email
    // This is temporary until domain verification is complete
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PWA Burton <onboarding@resend.dev>",
        to: ["burtonpwa@gmail.com"], // Temporary: send to verified email
        subject: `Payment Receipt - ${receiptNumber}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const emailData = await res.json();
    console.log("Email sent successfully:", {
      id: emailData.id,
      timestamp: new Date().toISOString(),
    });

    // Update receipt with email log
    const { error: updateError } = await supabase
      .from('payment_receipts')
      .update({ email_log_id: emailData.id })
      .eq('id', receipt.id);

    if (updateError) {
      console.error("Error updating receipt with email log:", updateError);
    }

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-payment-receipt function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);