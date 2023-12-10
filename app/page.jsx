import Link from 'next/link';

export default function Home() {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-semibold'>Welcome, Jerit!</h1>
        <Link href='/profile' className='text-blue-500 hover:underline'>
          Edit Profile
        </Link>
      </div>

      {/* Overview Widgets */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Upcoming Events */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold mb-4'>Upcoming Events</h2>
          {/* Display upcoming events here */}
          {/* You can use a calendar library for a more interactive display */}
        </div>

        {/* Quick Actions */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
          {/* Add buttons for quick actions */}
          <button className='btn-primary mb-2'>Add Memory</button>
          <button className='btn-primary mb-2'>Create Todo</button>
          <button className='btn-primary'>Start Chat</button>
        </div>

        {/* Featured Content */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold mb-4'>Featured Content</h2>
          {/* Display featured photos, blog entries, or collaborative art */}
          {/* You can use carousels or other interactive components */}
        </div>
      </div>

      {/* Global Unity Message */}
      <div className='bg-blue-100 p-4 rounded mt-8'>
        <h2 className='text-lg font-semibold mb-2 text-blue-800'>Global Unity Message</h2>
        <p className='text-gray-700'>
          "Let's make the world feel like one big family through Caelium. Share your stories and connect with others globally."
        </p>
      </div>
    </div>
  );
}
