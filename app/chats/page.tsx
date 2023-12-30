import ChatsPane from '@/components/chats/ChatsPane';
import SpeedDial from '@/components/chats/elements.tsx/SpeedDial';
import { Comforter } from 'next/font/google';
import Wrapper from '../Wrapper';
import { handleeFont } from '../font';

const comforter = Comforter({ weight: '400', subsets: ['cyrillic'] });

const page = () => {
  return (
    <Wrapper>
      <div className='flex flex-grow divide-x divide-dashed divide-gray-500'>
        <div className='flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <div className='flex max-sm:hidden flex-none flex-grow sm:w-3/4'>
          <div className='flex flex-col h-full flex-grow items-center justify-center'>
            <p
              className={`mb-20 text-center text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 ${comforter.className}`}>
              Caelium
              <p className='text-6xl m-0'>Elevating your Chat Experience</p>
              <button
                type='button'
                className={`${handleeFont.className} m-0 text-white bg-gradient-to-br from-sky-400 to-emerald-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}>
                Start New
              </button>
            </p>
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
};

export default page;
