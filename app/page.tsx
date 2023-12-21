import Wrapper from './Wrapper';

export default function Home() {
  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-semibold dark:text-white'>Welcome, Jerit!</h1>
        </div>
      </div>
    </Wrapper>
  );
}
