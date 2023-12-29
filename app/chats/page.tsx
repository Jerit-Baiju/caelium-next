import ChatsPane from '@/components/chats/ChatsPane';
import SpeedDial from '@/components/chats/elements.tsx/SpeedDial';
import { Comforter } from 'next/font/google';
import Wrapper from '../Wrapper';

const comforter = Comforter({ weight: '400', subsets: ['cyrillic'] });

const page = () => {
  return (
    <Wrapper>
      <div className='flex flex-grow divide-x divide-dashed divide-gray-500'>
        <div className='flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <div className='flex max-sm:hidden flex-none flex-grow sm:w-3/4 p-5'>
          <div className='flex flex-col h-full flex-grow items-center justify-center'>
            <p
              className={`py-12 text-center text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 ${comforter.className}`}>
              Caelium
              <p className='text-6xl'>Elevating your Chat Experience</p>
            </p>
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
};

export default page;
