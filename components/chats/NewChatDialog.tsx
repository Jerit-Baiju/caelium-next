import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User } from '@/helpers/props';
import useChatUtils from '@/hooks/useChat';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdGroupAdd } from 'react-icons/md';

interface NewChatDialogProps {
  onClose?: () => void;
}

const NewChatDialog = ({ onClose }: NewChatDialogProps) => {
  const { createChat, fetchNewChats, newChats, createGroup } = useChatUtils();
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isValid, setIsValid] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchNewChats().finally(() => setIsLoading(false));
  }, []);

  // Update validation state when dependencies change
  useEffect(() => {
    let error = '';
    if (isGroupMode) {
      if (!groupName.trim()) {
        error = 'Please enter a group name';
      } else if (selectedUsers.length < 2) {
        error = 'Please select at least 2 members';
      }
    }
    
    setValidationError(error);
    setIsValid(!error);
  }, [groupName, selectedUsers, isGroupMode]);
  
  // Reset interaction state when switching modes
  useEffect(() => {
    setHasInteracted(false);
  }, [isGroupMode]);

  const filteredChats = newChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateChat = (recipientId: number) => {
    if (isGroupMode) {
      const isSelected = selectedUsers.find((user) => user.id === recipientId);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== recipientId));
      } else {
        const user = newChats.find((chat) => chat.id === recipientId);
        if (user) {
          setSelectedUsers([...selectedUsers, user]);
        }
      }
      setHasInteracted(true);
    } else {
      createChat(recipientId);
      onClose?.();
    }
  };

  const handleCreateGroup = () => {
    setHasInteracted(true);
    if (!isValid) return;
    const participantIds = selectedUsers.map((user) => user.id);
    createGroup(groupName, participantIds);
    onClose?.();
  };
  
  // Handle group name input and mark form as interacted with
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    setHasInteracted(true);
  };

  return (
    <div className='flex flex-col h-[calc(100vh-6rem)] sm:h-[600px] bg-white dark:bg-neutral-900'>
      <div className='border-b border-neutral-200 dark:border-neutral-700 p-4 shrink-0'>
        {/* Modern, unified input area for group creation */}
        {isGroupMode ? (
          <div className='flex flex-col gap-2'>
            <input
              type='text'
              value={groupName}
              onChange={handleGroupNameChange}
              className='bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-1'
              placeholder='Group name (e.g. Project Team, Family, etc.)'
              maxLength={30}
            />
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                placeholder='Add people by name or email'
              />
            </div>
            {/* Only show validation error after user interaction */}
            {hasInteracted && validationError && (
              <p className='text-red-500 text-sm mt-1'>{validationError}</p>
            )}
          </div>
        ) : (
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              placeholder='Search by name or email'
            />
          </div>
        )}
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {isGroupMode && selectedUsers.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {selectedUsers.map((user) => (
              <div key={`chip-${user.id}`} className='flex items-center gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-white px-2 py-1 rounded-full'>
                <img src={user.avatar} alt={user.name} className='w-6 h-6 rounded-full' />
                <span>{user.name}</span>
                <button onClick={() => handleCreateChat(user.id)}>
                  <div className='hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full p-1'>
                    <FaTimes />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='overflow-y-auto h-full'>
          {isLoading ? (
            <div className='flex justify-center items-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white'></div>
            </div>
          ) : (
            <ul className='space-y-2'>
              {!isGroupMode && (
                <li
                  onClick={() => {
                    setIsGroupMode(true);
                  }}
                  className='p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                      <MdGroupAdd className="text-white text-xl" />
                    </div>
                    <div>
                      <p className='font-semibold text-neutral-900 dark:text-white'>Create Group</p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Start a new group chat</p>
                    </div>
                  </div>
                </li>
              )}

              {filteredChats.map(
                (recipient: User) =>
                  !selectedUsers.find((user) => user.id === recipient.id) && (
                    <li
                      key={recipient.id}
                      onClick={() => handleCreateChat(recipient.id)}
                      className='p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer'
                    >
                      <div className='flex items-center gap-3'>
                        <img className='w-12 h-12 rounded-full object-cover' src={recipient.avatar} alt={recipient.name} />
                        <div>
                          <p className='font-semibold text-neutral-900 dark:text-white'>{recipient.name}</p>
                          <p className='text-sm text-neutral-600 dark:text-neutral-400'>{recipient.email}</p>
                        </div>
                      </div>
                    </li>
                  ),
              )}
            </ul>
          )}
        </div>
      </div>

      {isGroupMode && (
        <div className='border-t border-neutral-200 dark:border-neutral-700 p-4 shrink-0'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCreateGroup}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  }`}
                  disabled={!isValid}
                >
                  <MdGroupAdd />
                  Create Group {selectedUsers.length > 0 && `(${selectedUsers.length} members)`}
                </button>
              </TooltipTrigger>
              {/* Only show tooltip with error after user interaction */}
              {hasInteracted && !isValid && (
                <TooltipContent className="bg-neutral-800 text-white p-2 rounded-md">
                  <p>{validationError}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default NewChatDialog;
