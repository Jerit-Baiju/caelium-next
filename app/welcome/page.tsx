'use client';
import { Vortex } from '@/components/ui/vortex';
import { signIn, signOut, useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  return (
    <div className='flex flex-col items-center justify-center h-screen dark:text-white'>
      <Vortex
        backgroundColor='black'
        rangeY={800}
        particleCount={100}
        baseHue={120}
        className='flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full'
      >
        <h1 className='text-center text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
          Welcome to Caelium
        </h1>
        <p className='text-xl text-center mb-8'>Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.</p>
        {!session ? (
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        ) : (
          <>
            <p>Welcome, {session.user?.name}</p>
            <p>{session.user.address}</p>
            <p>{session.user.email}</p>
            <img src={session.user?.image!} alt="" />

            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </Vortex>
    </div>
  );
};
export default Page;
