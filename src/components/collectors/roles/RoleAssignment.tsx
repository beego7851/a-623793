import { UserRole } from '@/types/collector-roles';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield } from 'lucide-react';

interface RoleAssignmentProps {
  userId: string | null;
  currentRoles: UserRole[];
  onRoleChange: (userId: string, role: UserRole) => Promise<void>;
}

export const RoleAssignment = ({
  userId,
  currentRoles,
  onRoleChange
}: RoleAssignmentProps) => {
  if (!userId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Manage Roles
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(['admin', 'collector', 'member'] as UserRole[]).map((role) => (
          !currentRoles.includes(role) && (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleChange(userId, role)}
            >
              <Shield className="mr-2 h-4 w-4" />
              Add {role}
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};