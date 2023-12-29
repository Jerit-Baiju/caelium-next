import ChatsPane from '@/components/chats/ChatsPane';
import SpeedDial from '@/components/chats/elements.tsx/SpeedDial';
import Wrapper from '../Wrapper';

const page = () => {
  return (
    <Wrapper>
      <div className='flex flex-grow divide-x divide-dashed divide-gray-500'>
        <div className='flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <div className='flex max-sm:hidden flex-none flex-grow sm:w-3/4 p-5'>
          <p className='text-white text-6xl'>Hello world</p>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
};

export default page;
