import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogOutButtonProps {
  onClick?: () => void;
}

const LogOutButton = ({ onClick }: LogOutButtonProps) => {
  return (
    <Button variant='destructive' className='flex items-center gap-2' onClick={onClick}>
      <LogOut className='h-4 w-4' />
      Sign Out
    </Button>
  );
};

export default LogOutButton;
