import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NotificationPromptProps {
  onClose: () => void;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ onClose }) => {
  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enable Notifications</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Stay connected and never miss a message! By enabling notifications, you'll receive instant alerts whenever someone sends you
          a message, even when you're not actively using the app.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClose}>Enable</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotificationPrompt;
