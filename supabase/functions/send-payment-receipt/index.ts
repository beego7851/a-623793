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
  paymentNumber
}: {
  receiptNumber: string;
  memberName: string;
  memberNumber: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  collectorName: string;
  paymentNumber: string;
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #1A1F2C; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1A1F2C; color: #FFFFFF;">
          <tr>
            <td style="padding: 40px 20px; text-align: center; background: linear-gradient(to right, #9b87f5, #7E69AB);">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold;">PWA Burton</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 20px; background-color: #2A2F3C;">
              <h2 style="color: #9b87f5; font-size: 24px; margin-bottom: 20px;">Payment Receipt</h2>
              
              <div style="background-color: #1A1F2C; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #3A3F4C;">
                <p style="color: #9b87f5; font-size: 16px; margin: 0 0 5px 0;">Receipt Number</p>
                <p style="color: #FFFFFF; font-size: 18px; margin: 0;">${receiptNumber}</p>
              </div>

              <div style="background-color: #1A1F2C; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #3A3F4C;">
                <p style="color: #9b87f5; font-size: 16px; margin: 0 0 5px 0;">Payment Reference</p>
                <p style="color: #FFFFFF; font-size: 18px; margin: 0;">${paymentNumber}</p>
              </div>

              <div style="margin: 20px 0;">
                <p style="color: #D6BCFA; margin: 5px 0;">Member Name: ${memberName}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Member Number: ${memberNumber}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Amount Paid: ${formattedAmount}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Payment Type: ${paymentType}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Payment Method: ${paymentMethod}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Collector: ${collectorName}</p>
                <p style="color: #D6BCFA; margin: 5px 0;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
              </div>

              <div style="border-top: 1px solid #3A3F4C; margin-top: 30px; padding-top: 20px;">
                <p style="color: #9b87f5; font-size: 16px; margin-bottom: 10px;">Need Help?</p>
                <p style="color: #FFFFFF; font-size: 14px; line-height: 20px;">If you have any questions about this payment, please contact your collector or PWA Burton administration.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #1A1F2C;">
              <p style="color: #9b87f5; font-size: 14px; margin: 0;">PWA Burton Team</p>
            </td>
          </tr>
        </table>
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

    // Get payment number from payment_requests table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payment_requests')
      .select('payment_number')
      .eq('id', paymentRequest.paymentId)
      .single();

    if (paymentError) {
      console.error("Error getting payment number:", paymentError);
      throw new Error("Failed to get payment number");
    }

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

    // Generate email HTML
    const emailHtml = generateReceiptEmail({
      receiptNumber,
      memberName: paymentRequest.memberName,
      memberNumber: paymentRequest.memberNumber,
      amount: paymentRequest.amount,
      paymentType: paymentRequest.paymentType,
      paymentMethod: paymentRequest.paymentMethod,
      collectorName: paymentRequest.collectorName,
      paymentNumber: paymentData.payment_number
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