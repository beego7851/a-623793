import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useMemberNotes } from '@/hooks/useMemberNotes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface NotesListProps {
  memberId: string;
}

const NotesList = ({ memberId }: NotesListProps) => {
  const { notes, isLoading, deleteNote } = useMemberNotes(memberId);
  const { toast } = useToast();

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-dashboard-text">Loading notes...</div>;
  }

  if (!notes?.length) {
    return <div className="text-dashboard-muted">No notes available</div>;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="p-4 bg-dashboard-card border-dashboard-cardBorder">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-dashboard-accent1">
                {format(new Date(note.created_at), 'dd/MM/yyyy HH:mm')}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-dashboard-muted capitalize">
                  {note.note_type}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-dashboard-muted hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Note</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this note? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(note.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-dashboard-text whitespace-pre-wrap">{note.note_text}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;