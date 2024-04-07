import React from 'react';
import Wrapper from '../Wrapper';

const StartExploringPage: React.FC = () => {
  return (
    <Wrapper>
      <div className='bg-gray-200 dark:bg-neutral-950 dark:text-white text-black py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6'>Welcome to Caelium!</h1>
          <p className='text-lg mb-8'>Explore and Connect with Your Spaces</p>
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>What You Can Do:</h2>
            <ul className='list-disc list-inside'>
              <li className='my-2'>
                <span className='font-bold'>Personal Space:</span>{' '}
                <span>
                  Keep track of your personal events, goals, and to-dos. Write private journal entries or share your thoughts with
                  others in your personal space.
                </span>
              </li>
              <li className='my-2'>
                <span className='font-semibold'>Family Space:</span> Coordinate family events and activities on the shared calendar.
                Collaborate on to-do lists and share important family updates or announcements.
              </li>
              <li className='my-2'>
                <span className='font-semibold'>Couple Space:</span> Enjoy exclusive features designed for couples, such as shared
                music playlists and interactive games. Plan romantic dates, set relationship goals, and cherish shared memories.
              </li>
              <li className='my-2'>
                <span className='font-semibold'>Work Space:</span> Collaborate with your colleagues on projects and tasks. Schedule
                meetings, share documents, and stay connected with your team.
              </li>
            </ul>
          </div>
          <p className='text-xl mb-4'>Under Development</p>
          <p className='text-lg mb-8'>
            Please note that Caelium is currently under development. We're working hard to bring you the best possible experience, but
            there may be some features that are still in progress or undergoing improvements.
          </p>
          <p className='text-xl mb-4'>Your Feedback Matters!</p>
          <p className='text-lg mb-8'>
            We value your input! If you have any suggestions for new features or notice any bugs or issues, please let us know. You can
            submit your feedback, feature requests, or bug reports via the "Help/Support" section in the top navigation bar. We greatly
            appreciate your help in making Caelium even better!
          </p>
          <div className='mt-8 flex flex-col items-center'>
            <button className='bg-black dark:bg-white dark:hover:bg-neutral-300 dark:text-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800'>
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default StartExploringPage;
