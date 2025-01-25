import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog = ({ open, onOpenChange }: ForgotPasswordDialogProps) => {
  const [memberNumber, setMemberNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if member exists and get their profile
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("email, auth_user_id, phone")
        .eq("member_number", memberNumber)
        .single();

      if (memberError) throw new Error("Invalid member number");

      if (member.email && member.email !== email) {
        throw new Error("Please use your registered email address");
      }

      // Generate reset token
      const { data: token, error: tokenError } = await supabase
        .rpc('generate_password_reset_token', { 
          p_member_number: memberNumber 
        });

      if (tokenError) throw tokenError;

      // Update member profile with new contact details
      const { error: updateError } = await supabase
        .from("members")
        .update({ 
          email,
          phone 
        })
        .eq("member_number", memberNumber);

      if (updateError) throw updateError;

      // Send reset email with enhanced template
      const resetLink = `${window.location.origin}/reset-password?token=${token}`;
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: [email],
          subject: "Reset Your PWA Burton Password",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
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
                      <h2 style="color: #9b87f5; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h2>
                      <p style="color: #FFFFFF; font-size: 16px; line-height: 24px; margin-bottom: 20px;">Hello,</p>
                      <p style="color: #FFFFFF; font-size: 16px; line-height: 24px; margin-bottom: 20px;">We received a request to reset your password. Click the button below to set a new password:</p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #9b87f5; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background-color 0.3s ease;">Reset Password</a>
                      </div>
                      <p style="color: #FFFFFF; font-size: 14px; line-height: 20px; margin-bottom: 20px;">This link will expire in 1 hour for security reasons. If you didn't request this reset, please ignore this email.</p>
                      <div style="border-top: 1px solid #3A3F4C; margin: 30px 0; padding-top: 20px;">
                        <p style="color: #9b87f5; font-size: 16px; margin-bottom: 10px;">Need Help?</p>
                        <p style="color: #FFFFFF; font-size: 14px; line-height: 20px;">If you're having trouble with the button above, copy and paste the following URL into your web browser:</p>
                        <p style="color: #D6BCFA; font-size: 12px; word-break: break-all;">${resetLink}</p>
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
          `,
          memberNumber,
          emailType: 'password_reset'
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-dashboard-dark border-dashboard-cardBorder">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#9b87f5]">Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 mb-4">
            <p className="text-yellow-500 text-sm">
              Allow up to 15 minutes before retrying.
            </p>
          </div>
          <div>
            <label htmlFor="memberNumber" className="block text-sm font-medium text-dashboard-text mb-2">
              Member Number
            </label>
            <Input
              id="memberNumber"
              value={memberNumber}
              onChange={(e) => setMemberNumber(e.target.value.toUpperCase())}
              placeholder="Enter your member number"
              required
              disabled={loading}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text focus:border-[#9b87f5]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dashboard-text mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text focus:border-[#9b87f5]"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dashboard-text mb-2">
              Contact Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your contact number"
              required
              disabled={loading}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text focus:border-[#9b87f5]"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="bg-dashboard-card hover:bg-dashboard-cardHover text-dashboard-text border-dashboard-cardBorder"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};