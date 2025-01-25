import { useState } from 'react';
import { Member } from '@/types/member';
import { Collector } from "@/types/collector";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { format } from 'date-fns';
import PaymentDialog from './PaymentDialog';
import NotesDialog from './notes/NotesDialog';
import NotesList from './notes/NotesList';
import EditProfileDialog from './EditProfileDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import MemberPasswordSection from './card/MemberPasswordSection';
import MemberPaymentHistory from './card/MemberPaymentHistory';

interface MemberCardProps {
  member: Member;
  userRole: string | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const MemberCard = ({ member, userRole, onEditClick, onDeleteClick }: MemberCardProps) => {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { toast } = useToast();
  const { hasRole } = useRoleAccess();
  const isCollector = hasRole('collector');
  const canModify = userRole === 'admin' || userRole === 'collector';

  const { data: collectorInfo } = useQuery({
    queryKey: ['collector', member.collector],
    queryFn: async () => {
      if (!member.collector) return null;
      
      const { data: collectorData, error } = await supabase
        .from('members_collectors')
        .select('*')
        .eq('name', member.collector)
        .maybeSingle();
      
      if (error) throw error;

      if (collectorData) {
        const collector: Collector = {
          ...collectorData,
          roles: [],
          enhanced_roles: [],
          permissions: {
            canManageUsers: false,
            canCollectPayments: true,
            canAccessSystem: true,
            canViewAudit: false,
            canManageCollectors: false
          }
        };
        return collector;
      }
      return null;
    },
    enabled: !!member.collector
  });

  const handlePaymentClick = () => {
    if (!isCollector && userRole !== 'admin') {
      toast({
        title: "Not Authorized",
        description: "Only collectors or admins can record payments",
        variant: "destructive"
      });
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  return (
    <AccordionItem value={member.id} className="border-b border-white/10">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-left px-1">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dashboard-accent1">{member.full_name}</h3>
            <p className="text-sm text-dashboard-muted">Member Number: {member.member_number}</p>
          </div>
          {(canModify || userRole === 'admin') && (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditProfileOpen(true);
                }} 
                className="bg-dashboard-accent2 hover:bg-dashboard-accent2/80"
              >
                Edit
              </Button>
              {userRole === 'admin' && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }} 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentClick();
                }} 
                className="bg-dashboard-accent3 hover:bg-dashboard-accent3/80"
              >
                Pay
              </Button>
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-dashboard-accent1">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dashboard-card p-3 rounded-lg border border-dashboard-cardBorder">
              <p className="text-sm text-dashboard-text">Email: <span className="text-white">{member.email || 'Not provided'}</span></p>
              <p className="text-sm text-dashboard-text">Phone: <span className="text-white">{member.phone || 'Not provided'}</span></p>
              <p className="text-sm text-dashboard-text">Date of Birth: <span className="text-white">{member.date_of_birth ? format(new Date(member.date_of_birth), 'dd/MM/yyyy') : 'Not provided'}</span></p>
              <p className="text-sm text-dashboard-text">Gender: <span className="text-white">{member.gender || 'Not provided'}</span></p>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-dashboard-accent2">Address Details</h4>
            <div className="bg-dashboard-card p-3 rounded-lg border border-dashboard-cardBorder">
              <p className="text-sm text-dashboard-text">Street: <span className="text-white">{member.address || 'Not provided'}</span></p>
              <p className="text-sm text-dashboard-text">Town: <span className="text-white">{member.town || 'Not provided'}</span></p>
              <p className="text-sm text-dashboard-text">Postcode: <span className="text-white">{member.postcode || 'Not provided'}</span></p>
            </div>
          </div>

          {/* Password Management Section for admins */}
          {userRole === 'admin' && (
            <MemberPasswordSection 
              memberNumber={member.member_number}
              memberId={member.id}
              memberName={member.full_name}
              passwordSetAt={member.password_set_at ? new Date(member.password_set_at) : null}
              failedLoginAttempts={member.failed_login_attempts}
              lockedUntil={member.locked_until ? new Date(member.locked_until) : null}
              passwordResetRequired={member.password_reset_required}
            />
          )}

          {/* Payment History */}
          <MemberPaymentHistory memberId={member.id} />

          {/* Notes Section */}
          {userRole === 'admin' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-dashboard-accent1">Notes</h4>
                <Button 
                  onClick={() => setIsNoteDialogOpen(true)}
                  className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
                >
                  Add Note
                </Button>
              </div>
              <NotesList memberId={member.id} />
            </div>
          )}

          <PaymentDialog
            isOpen={isPaymentDialogOpen}
            onClose={() => setIsPaymentDialogOpen(false)}
            memberId={member.id}
            memberNumber={member.member_number}
            memberName={member.full_name}
            collectorInfo={collectorInfo}
          />

          <NotesDialog
            isOpen={isNoteDialogOpen}
            onClose={() => setIsNoteDialogOpen(false)}
            memberId={member.id}
          />

          <EditProfileDialog
            member={member}
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            onProfileUpdated={() => window.location.reload()}
          />
        </div>
      </AccordionContent>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDeleteConfirm(false);
                onDeleteClick();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccordionItem>
  );
};

export default MemberCard;