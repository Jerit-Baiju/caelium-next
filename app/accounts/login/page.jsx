import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-500 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Welcome Back to Caelium</h1>
      <form className='w-full max-w-sm'>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300'
            type='email'
            id='email'
            placeholder='Enter your email'
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-bold mb-2' htmlFor='password'>
            Password
          </label>
          <input
            className='w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300'
            type='password'
            id='password'
            placeholder='Enter your password'
          />
        </div>
        <button className='bg-white text-blue-500 px-6 py-3 rounded-full font-bold hover:bg-blue-100' type='submit'>
          Log In
        </button>
      </form>
      <p className='mt-4'>
        <Link href='register' className='text-blue-200 hover:underline'>
          Don&apos;t have an account?
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
