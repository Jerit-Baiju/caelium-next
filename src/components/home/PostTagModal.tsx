import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User } from '@/helpers/props';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiLoader, FiSearch } from 'react-icons/fi';

interface PostTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserTagApply: (users: User[]) => void;
  selectedUsers: User[];
}

const PostTagModal: React.FC<PostTagModalProps> = ({ isOpen, onClose, onUserTagApply, selectedUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from the backend (or use dummy data for now)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch from an API
      // For now, let's use dummy data with Pravatar images
      const dummyUsers: User[] = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        username: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`, // Using Pravatar for images
        last_seen: new Date(),
        birthdate: new Date(),
        location: 'Location',
        gender: 'Unspecified',
      }));

      // Add the currently selected users to ensure they appear in the list
      const existingUserIds = new Set(dummyUsers.map((user) => user.id));
      const selectedUsersMissing = selectedUsers.filter((user) => !existingUserIds.has(user.id));

      setAllUsers([...dummyUsers, ...selectedUsersMissing]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset selections when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Initialize selected user IDs from the provided selectedUsers
      setSelectedUserIds(selectedUsers.map((user) => user.id));
      setSearchQuery('');
      fetchUsers();
    }
  }, [isOpen, selectedUsers]);

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers;

  // Toggle user selection
  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      // If user is already selected, remove it
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      // Otherwise add it to the end of the array
      return [...prev, userId];
    });
  };

  // Apply selected users
  const handleApply = () => {
    const selectedUsersData = allUsers.filter((user) => selectedUserIds.includes(user.id));
    onUserTagApply(selectedUsersData);
    onClose();
  };

  // Custom close handler that resets state
  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md bg-neutral-950/80 border-border shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Tag People</DialogTitle>
          <DialogDescription>Search and select people to tag in your post</DialogDescription>
        </DialogHeader>

        <div className='relative mt-2'>
          <FiSearch className='absolute left-3 top-3 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-background border-border'
          />
        </div>

        <div className='mt-4'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <FiLoader className='animate-spin text-primary' size={24} />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className='max-h-[300px] overflow-y-auto'>
              <div className='flex flex-col gap-2'>
                {(() => {
                  // Get all selected users regardless of search query
                  const selectedUserObjects = allUsers.filter((user) => selectedUserIds.includes(user.id));

                  // Then get all the unselected users that match the filter criteria
                  const unselectedFilteredUsers = filteredUsers.filter((user) => !selectedUserIds.includes(user.id));

                  // Always include selected users first, then filtered unselected users
                  const orderedUsers = [...selectedUserObjects, ...unselectedFilteredUsers];

                  // Render the combined list with AnimatePresence
                  return (
                    <AnimatePresence>
                      {orderedUsers.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                          <motion.div
                            key={user.id}
                            onClick={() => toggleUser(user.id)}
                            className='cursor-pointer'
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                              duration: 0.2,
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}>
                            <div
                              className={`flex items-center p-2 rounded-lg gap-3 ${
                                isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800/30'
                              }`}>
                              <div className='h-10 w-10 rounded-full overflow-hidden'>
                                <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                              </div>
                              <div className='flex flex-col'>
                                <span className='font-medium'>{user.name}</span>
                                <span className='text-sm text-neutral-400'>@{user.username}</span>
                              </div>
                              {isSelected && <Badge className='ml-auto bg-primary text-primary-foreground'>Selected</Badge>}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>
              {searchQuery ? 'No users match your search' : 'No users available'}
            </div>
          )}
        </div>

        <DialogFooter className='sm:justify-between mt-6'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Tags</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostTagModal;
