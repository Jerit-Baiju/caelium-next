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
import { Chat } from '@/helpers/props';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useContext } from 'react';

interface DeleteChatDialogProps {
  chat: Chat | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (chat: Chat) => void;
}

export const DeleteChatDialog = ({ chat, isOpen, onClose, onDelete }: DeleteChatDialogProps) => {
  const { user } = useContext(AuthContext);
  if (!chat) return null;

  const chatName = chat.is_group ? chat.name : chat.participants.find((p) => p.id !== user?.id)?.name;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <Trash2 className='w-5 h-5 text-red-500' />
            <span>Delete Conversation</span>
          </AlertDialogTitle>
          <div className='pt-2'>
            <AlertDialogDescription className='text-sm text-neutral-600 dark:text-neutral-400'>
              Are you sure you want to delete your conversation with{' '}
              <span className='font-medium text-neutral-900 dark:text-neutral-200'>{chatName}</span>?
            </AlertDialogDescription>
            <AlertDialogDescription className='mt-2 text-sm text-red-500'>This action cannot be undone.</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-2 mt-4'>
          <AlertDialogCancel className='w-full sm:w-auto'>Cancel</AlertDialogCancel>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='w-full sm:w-auto'>
            <AlertDialogAction onClick={() => onDelete(chat)} className='w-full bg-red-500 hover:bg-red-600 text-white'>
              Delete Conversation
            </AlertDialogAction>
          </motion.div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
