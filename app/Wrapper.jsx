import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';

const Wrapper = ({ children }) => {
  return (
    <main className='min-h-screen'>
      <NavBar />
      <SideBar />
      <div className='p-4 sm:ml-64 pt-20'>
        <div className='p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700'>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
