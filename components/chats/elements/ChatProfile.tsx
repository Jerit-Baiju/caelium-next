import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaPhone, FaVideo } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoArrowBack, IoNotifications, IoPerson, IoPersonRemoveSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import ChatMediaTabs from './ChatMediaTabs';

const ChatProfile = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { meta, getParticipant, getLastSeen } = useChatContext();
  const [showParticipants, setShowParticipants] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const recipient = getParticipant(meta?.participants.find((p) => p.id !== user.id)?.id ?? 0);

  const filteredParticipants = meta?.participants.filter((participant) => {
    const participantDetails = getParticipant(participant.id);
    return participantDetails?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const adminParticipants = filteredParticipants?.filter((p) => p.id === meta?.creator) ?? [];
  const normalParticipants = filteredParticipants?.filter((p) => p.id !== meta?.creator) ?? [];

  return (
    <div className='flex flex-col flex-grow sm:w-3/4 bg-white dark:bg-neutral-900'>
      <div className='flex-1 overflow-y-auto'>
        {/* Profile Header */}
        <div className='border-b border-neutral-200 dark:border-neutral-800'>
          <div className='flex flex-col items-center p-8 relative'>
            <button
              onClick={() => router.push(`/chats/${meta?.id}`)}
              className='absolute left-2 top-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full'
            >
              <IoArrowBack className='text-2xl text-neutral-800 dark:text-white' />
            </button>
            <div className='relative'>
              {!meta?.is_group ? (
                <img src={recipient?.avatar} alt='Profile' className='w-40 h-40 rounded-full object-cover bg-white' />
              ) : meta?.group_icon ? (
                <img src={meta?.group_icon} alt='Group Icon' className='w-40 h-40 rounded-full object-cover bg-white' />
              ) : (
                <div className='flex items-center justify-center w-40 h-40 dark:text-black rounded-full bg-white border dark:border-neutral-500 border-neutral-200 object-cover'>
                  <i className='fa-solid fa-people-group text-7xl'></i>
                </div>
              )}
            </div>
            <h1 className='text-2xl font-semibold mt-4 text-neutral-900 dark:text-white'>
              {meta?.is_group ? meta.name : recipient?.name}
            </h1>
            <div className='text-neutral-600 dark:text-neutral-400'>
              {!meta?.is_group
                ? getLastSeen(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)
                : `Group • ${meta.participants.length} Participants`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-around p-4 border-b border-neutral-200 dark:border-neutral-800'>
          <button className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              <FaVideo className='text-xl text-blue-500' />
            </div>
            <span className='text-sm'>Video</span>
          </button>
          <button onClick={() => setShowParticipants(true)} className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              {meta?.is_group ? <FaPeopleGroup className='text-xl text-blue-500' /> : <IoPerson className='text-xl text-blue-500' />}
            </div>
            <span className='text-sm'>{meta?.is_group ? 'Participants' : 'Profile'}</span>
          </button>
          <button className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              <FaPhone className='text-xl text-blue-500' />
            </div>
            <span className='text-sm'>Call</span>
          </button>
        </div>

        {/* Settings */}
        <div className='flex flex-col p-4 space-y-4'>
          <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
            <IoNotifications className='text-xl mr-4 text-blue-500' />
            <span>Mute notifications</span>
          </button>
          {!meta?.is_group && (
            <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
              <IoPersonRemoveSharp className='text-xl mr-4 text-red-500' />
              <span>Block contact</span>
            </button>
          )}
          <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
            <MdDelete className='text-xl mr-4 text-red-500' />
            <span>Delete chat</span>
          </button>
        </div>

        {/* Participants Dialog */}
        <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
          <DialogContent className='max-w-md bg-white dark:bg-neutral-950 rounded-2xl'>
            <DialogHeader className='border-b dark:border-neutral-800 pb-4'>
              <DialogTitle className='text-xl'>Group participants</DialogTitle>
              <div className='mt-4'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search participants'
                    className='w-full py-2 px-4 pl-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm focus:outline-none'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className='w-4 h-4 absolute left-3 top-3 text-neutral-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
              </div>
            </DialogHeader>

            <div className='space-y-1 max-h-[60vh] overflow-y-auto py-2'>
              {/* Group admins section */}
              {adminParticipants.length > 0 && (
                <>
                  <div className='px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400'>
                    {adminParticipants.length} Group admin
                  </div>
                  {adminParticipants.map((participant) => {
                    const participantDetails = getParticipant(participant.id);
                    return (
                      <div key={participant.id} className='flex items-center px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                        <img
                          src={participantDetails?.avatar}
                          alt={participantDetails?.name}
                          className='w-12 h-12 rounded-full object-cover bg-white'
                        />
                        <div className='flex-1 ml-3'>
                          <div className='flex items-center gap-2'>
                            <h3 className='text-neutral-900 dark:text-white font-medium'>
                              {participant.id === user.id ? 'You' : participantDetails?.name}
                            </h3>
                            <span className='text-xs text-neutral-500 dark:text-neutral-400'>Group admin</span>
                          </div>
                          <p className='text-sm text-neutral-500 dark:text-neutral-400'>{getLastSeen(participant.id)}</p>
                        </div>
                        {user.id === meta?.creator && participant.id !== user.id && (
                          <button className='p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full'>
                            <IoPersonRemoveSharp className='text-red-500' />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {/* Other participants section */}
              {normalParticipants.length > 0 && (
                <>
                  <div className='px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400'>
                    {normalParticipants.length} participants
                  </div>
                  {normalParticipants.map((participant) => {
                    const participantDetails = getParticipant(participant.id);
                    return (
                      <div key={participant.id} className='flex items-center px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                        <img
                          src={participantDetails?.avatar}
                          alt={participantDetails?.name}
                          className='w-12 h-12 rounded-full object-cover bg-white'
                        />
                        <div className='flex-1 ml-3'>
                          <h3 className='text-neutral-900 dark:text-white font-medium'>
                            {participant.id === user.id ? 'You' : participantDetails?.name}
                          </h3>
                          <p className='text-sm text-neutral-500 dark:text-neutral-400'>{getLastSeen(participant.id)}</p>
                        </div>
                        {user.id === meta?.creator && participant.id !== user.id && (
                          <button className='p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full'>
                            <IoPersonRemoveSharp className='text-red-500' />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {filteredParticipants?.length === 0 && (
                <div className='px-4 py-8 text-center text-neutral-500 dark:text-neutral-400'>No participants found</div>
              )}
            </div>

            {user.id === meta?.creator && (
              <div className='mt-4 border-t dark:border-neutral-800 pt-4'>
                <button className='w-full text-left px-4 py-3 text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg'>
                  Delete group
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Media Section */}
        <div className='p-4 border-t border-neutral-200 dark:border-neutral-800'>
          <h2 className='text-lg font-semibold mb-4 text-neutral-900 dark:text-white'>Media, links and documents</h2>
          <ChatMediaTabs chatId={meta?.id ?? 0} />
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
