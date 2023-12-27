interface Chat {
  id: number;
  name: string;
}
const SideBar: React.FC<{ chats: Chat[] }> = ({ chats }) => {
  return (
    <div className='w-full md:w-1/4 flex-grow-0 md:pr-4 md:border-r border-gray-200 dark:border-gray-700'>
      <h2 className='text-lg font-semibold mb-4'>Persons to Chat</h2>
      <ul role='list' className='max-w-sm divide-y divide-gray-200 dark:divide-gray-700'>
        {chats.map((chat) => (
          <li className='py-3 sm:py-4'>
            <div className='flex items-center space-x-3 rtl:space-x-reverse'>
              <div className='flex-shrink-0'>
                <img className='w-8 h-8 rounded-full' src='http://192.168.43.157:8000/media/avatars/default.png' alt='Neil image' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{chat.name}</p>
                <p className='text-sm text-gray-500 truncate dark:text-gray-400'>email@flowbite.com</p>
              </div>
              <span className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                <span className='w-2 h-2 me-1 bg-green-500 rounded-full'></span>
                Available
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
