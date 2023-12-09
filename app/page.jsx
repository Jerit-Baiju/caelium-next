export default function Home() {
  return (
    <main className='min-h-screen'>
      <div class='bg-gray-600 text-white py-16'>
        <div class='container mx-auto text-center'>
          <h1 class='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>Welcome to [Your Family Name] Planner!</h1>
          <p class='text-lg md:text-xl lg:text-2xl mb-8'>Stay organized and connected with your family.</p>
          <a
            href='#get-started'
            class='bg-white text-blue-500 py-2 px-6 rounded-full font-semibold text-lg hover:bg-blue-700 hover:text-white transition duration-300'>
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
