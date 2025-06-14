import LogoutButton from '@/components/base/buttons/LogOutButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AuthContext from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext } from 'react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutDialog = ({ isOpen, onClose }: LogoutDialogProps) => {
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='max-w-md'>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}>
          <AlertDialogHeader className='text-center space-y-3'>
            <div className='space-y-2'>
              <AlertDialogTitle className='text-xl font-semibold'>Sign out of your account?</AlertDialogTitle>
              <AlertDialogDescription className='text-sm text-muted-foreground leading-relaxed'>
                You'll be signed out of Caelium and will need to sign in again to access your account.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2 mt-6'>
            <AlertDialogCancel onClick={onClose} className='mt-2 sm:mt-0'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <LogoutButton onClick={handleLogout} />
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutDialog;
