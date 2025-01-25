import { Shield } from "lucide-react";

export const PasswordRequirements = () => {
  const requirements = [
    "At least 8 characters long",
    "At least one uppercase letter",
    "At least one lowercase letter",
    "At least one number",
    "At least one special character (!@#$%^&*(),.?\":{}|<>)"
  ];

  return (
    <div className="p-4 rounded-lg bg-dashboard-cardHover/50 border border-dashboard-cardBorder mb-4">
      <div className="flex items-start gap-2 text-dashboard-muted">
        <Shield className="w-4 h-4 mt-1 shrink-0" />
        <div className="space-y-1 text-sm">
          <p className="font-medium mb-2">Password Requirements:</p>
          <ul className="list-disc pl-4 space-y-1">
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};