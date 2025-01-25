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

export interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  memberNumber?: string;
  emailType?: string;
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Processing email request:", {
      to: emailRequest.to,
      subject: emailRequest.subject,
      timestamp: new Date().toISOString(),
    });

    // Create initial log entry
    const { data: logEntry, error: logError } = await supabase
      .from('email_logs')
      .insert({
        member_number: emailRequest.memberNumber,
        email_type: emailRequest.emailType || 'notification',
        recipient_email: emailRequest.to[0],
        subject: emailRequest.subject,
        status: 'pending',
        metadata: {
          additional_recipients: emailRequest.to.slice(1),
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (logError) {
      console.error("Error creating email log:", logError);
      throw new Error("Failed to create email log");
    }

    // In test mode, we can only send to burtonpwa@gmail.com
    const testEmail = "burtonpwa@gmail.com";
    const isTestMode = !Deno.env.get("PRODUCTION");
    const recipientEmails = isTestMode ? [testEmail] : emailRequest.to;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PWA Burton <onboarding@resend.dev>",
        to: recipientEmails,
        subject: emailRequest.subject,
        html: emailRequest.html,
        reply_to: emailRequest.replyTo,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);

      // Update log with error
      await supabase
        .from('email_logs')
        .update({
          status: 'failed',
          error_message: error
        })
        .eq('id', logEntry.id);

      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", {
      id: data.id,
      timestamp: new Date().toISOString(),
    });

    // Update log with success
    await supabase
      .from('email_logs')
      .update({
        status: 'sent',
        resend_id: data.id,
        delivered_at: new Date().toISOString()
      })
      .eq('id', logEntry.id);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);