'use client';
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

interface InputProps {
  name: string;
  label?: string;
  type: string;
  placeholder: string;
  id?: string;
  error?: string;
  autofocus?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ name, label, type, placeholder, id, error, autofocus = false, required = false }) => {
  return (
    <div className='max-w-sm mx-auto mb-4'>
      <label htmlFor={id} className='input input-bordered flex items-center gap-2 m-4'>
        {label}
        <input id={id} name={name} required={required} autoFocus={autofocus} type={type} className='grow' placeholder={placeholder} />
      </label>
      {error && <p className='mt-2 text-sm text-red-600 dark:text-red-500 font-medium'>{error}</p>}
    </div>
  );
};

const Auth = ({ page }: { page?: string }) => {
  let { loginUser, registerUser, error } = useContext(AuthContext);
  const router = useRouter();
  let { tokenData } = useContext(AuthContext);
  const isLoginPage = page === 'login';

  useEffect(() => {
    if (tokenData) {
      router.push('/');
    }
  }, [router, tokenData]);

  return (
    <div className='flex flex-col p-5 items-center justify-center h-screen dark:text-white'>
      <div className='flex justify-center flex-col items-center border-2 border-neutral-400 p-10 rounded-lg'>
        <h1 className='text-4xl font-bold mb-4'>{isLoginPage ? 'Welcome Back to Caelium' : 'Create Your Caelium Account'}</h1>
        <form method='POST' onSubmit={isLoginPage ? (e) => loginUser(e) : (e) => registerUser(e)} className='w-full'>
          <div className='p-4 mb-4 text-sm text-red-800 rounded-lg dark:text-red-400' role='alert'></div>
          {isLoginPage && (
            <div>
              <Input
                name='username'
                label='Username'
                type='text'
                id='usernameID'
                placeholder='Enter your username'
                error={error['detail']}
                autofocus
              />
              <Input name='password' label='Password' type='password' id='password' placeholder='••••••••' />
            </div>
          )}
          {!isLoginPage && (
            <div>
              <Input
                name='username'
                label='Username'
                type='text'
                id='usernameID'
                placeholder='martin_boyer'
                error={error['username']}
                autofocus
              />
              <Input name='name' label='Name' type='text' id='nameID' placeholder='Martin Boyer' error={error['name']} />
              <Input name='password' label='Password' type='password' id='password' placeholder='••••••••' error={error['password']} />
            </div>
          )}
          <div className='flex justify-center flex-col items-center'>
            <button
              className='bg-neutral-600 text-white px-6 py-3 mt-4 rounded-3xl font-extrabold w-1/3 hover:bg-neutral-300 hover:text-black'
              type='submit'
            >
              {isLoginPage ? 'Log In' : 'Sign Up'}
            </button>
            <p className='mt-4'>
              {isLoginPage ? (
                <Link href='register' className='hover:underline text-center'>
                  Don&apos;t have an account?
                </Link>
              ) : (
                <Link href='login' className='hover:underline text-center'>
                  Already have an account?
                </Link>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
