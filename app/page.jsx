import NavBar from "@/components/NavBar";

export default function Home() {
  return (
      <main className='bg-slate-100 min-h-screen'>
        <NavBar/>
        <div className='flex flex-col items-center justify-center h-screen bg-blue-500 text-white'>
          <h1 className='text-5xl font-bold mb-6'>Welcome to Caelium</h1>
        </div>
      </main>
  );
}
