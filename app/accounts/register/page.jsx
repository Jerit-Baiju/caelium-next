import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-500 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Create Your Caelium Account</h1>
      <form className='w-full max-w-sm'>
        <div className='mb-4'>
          <label className='block font-bold mb-2' htmlFor='username'>
            Username
          </label>
          <input
            className='w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300 text-blue-700'
            type='text'
            id='username'
            placeholder='Enter your username'
          />
        </div>
        <div className='mb-4'>
          <label className='block font-bold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300 text-blue-700'
            type='email'
            id='email'
            placeholder='Enter your email'
          />
        </div>
        <div className='mb-6'>
          <label className='block font-bold mb-2' htmlFor='password'>
            Password
          </label>
          <input
            className='w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300 text-blue-700'
            type='password'
            id='password'
            placeholder='Enter your password'
          />
        </div>
        <div className='flex justify-center'>
          <button className='bg-white text-sky-800 px-6 py-3 rounded-3xl font-extrabold w-1/3 hover:bg-blue-50' type='submit'>
            Sign Up
          </button>
        </div>
      </form>
      <p className='mt-4'>
        <Link href='login' className='text-blue-200 hover:underline'>
          Already have an account?
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
