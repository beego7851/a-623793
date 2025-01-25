import PasswordManagementSection from "../password/PasswordManagementSection";

interface MemberPasswordSectionProps {
  memberNumber: string;
  memberId: string;
  memberName: string;
  passwordSetAt?: Date | null;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  passwordResetRequired?: boolean;
}

const MemberPasswordSection = ({ 
  memberNumber,
  memberId,
  memberName,
  passwordSetAt = null,
  failedLoginAttempts = 0,
  lockedUntil = null,
  passwordResetRequired = false
}: MemberPasswordSectionProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-dashboard-accent1">Password Management</h4>
      <div className="bg-dashboard-card p-3 rounded-lg border border-dashboard-cardBorder">
        <PasswordManagementSection
          memberId={memberId}
          memberNumber={memberNumber}
          memberName={memberName}
          passwordSetAt={passwordSetAt}
          failedLoginAttempts={failedLoginAttempts}
          lockedUntil={lockedUntil}
          passwordResetRequired={passwordResetRequired}
        />
      </div>
    </div>
  );
};

export default MemberPasswordSection;