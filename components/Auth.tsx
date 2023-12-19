'use client';
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import { useContext } from 'react';

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  id?: string;
  autofocus?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ name, type, placeholder, id, autofocus = false, required = false }) => {
  return (
    <div className='max-w-sm mx-auto mb-4'>
      <label htmlFor={id} className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
        {name}
      </label>
      <input
        type={type}
        id={id}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        placeholder={placeholder}
        required={required}
        autoFocus={autofocus}
      />
    </div>
  );
};

const Auth = ({ page } : { page?: string}) => {
  let { loginUser, error } = useContext(AuthContext);

  console.log(page, loginUser)

  return (
    <div className='flex flex-col items-center justify-center h-screen dark:text-white'>
      <div className='flex justify-center flex-col items-center border-2 border-gray-400 p-10 rounded-lg'>
        <h1 className='text-4xl font-bold mb-4'>{page === 'login' ? 'Welcome Back to Caelium' : 'Create Your Caelium Account'}</h1>
        <form onSubmit={page === 'login' ? loginUser : (e) => {console.log("not login page")}} className='w-full'>
          <div className='p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400' role='alert'>
            <span className='font-extrabold'>{error}</span>
          </div>
          <Input name='Username' type='text' id='usernameID' placeholder='Enter your username' autofocus />
          <Input name='Password' type='password' id='password' placeholder='Enter your password' />
          <div className='flex justify-center flex-col items-center'>
            <button
              className='bg-gray-600 text-white px-6 py-3 mt-4 rounded-3xl font-extrabold w-1/3 hover:bg-gray-300 hover:text-black'
              type='submit'>
              {page === 'login' ? 'Log In' : 'Sign Up'}
            </button>
            <p className='mt-4'>
              {page === 'login' ? (
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
