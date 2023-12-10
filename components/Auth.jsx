import Link from 'next/link';

export const Input = (props) => {
  const { name, type, placeholder, id } = props;
  return (
    <div className='mb-4'>
      <label className='block font-bold mb-2' htmlFor={id}>
        {name}
      </label>
      <input className='w-full px-3 py-2 border-2 rounded border-gray-200 focus:outline-none focus:border-gray-400' type={type} id={id} placeholder={placeholder} />
    </div>
  );
};

const Auth = (props) => {
  const { page } = props;
  return (
    <div className='flex flex-col items-center justify-center h-screen -mt-20 dark:text-white'>
      <div className='border-2 border-gray-400 p-10 rounded-lg flex justify-center flex-col items-center'>
        <h1 className='text-4xl font-bold mb-4'>{page === 'login' ? 'Welcome Back to Caelium' : 'Create Your Caelium Account'}</h1>
        <form className='w-full max-w-sm'>
          <Input name='Email' type='email' placeholder='Enter your email' />
          <Input name='Password' type='password' placeholder='Enter your password' />
          <div className='flex justify-center flex-col items-center'>
            <button className='bg-gray-600 text-white px-6 py-3 rounded-3xl font-extrabold w-1/3 hover:bg-gray-300 hover:text-black' type='submit'>
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
