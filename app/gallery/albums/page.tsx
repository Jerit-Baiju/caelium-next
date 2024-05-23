import Wrapper from '@/app/Wrapper';
import Link from 'next/link';

const Albums = () => {
  const images = [
    'https://images.unsplash.com/photo-1715351190944-a32bc9a900ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715586041798-9583f0642747?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715624849529-3f99fafffee5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1NHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714572877812-7b416fbd4314?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714715362537-4aa538a6f0ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1715639732762-cf660da518c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <Wrapper>
      <div className='p-4'>
        <div className='flex justify-between border-b px-10'>
          <p className='text-3xl w-1/2 font-bold p-1'>Albums</p>
          <div className='flex items-center justify-end'>
            <Link href={'/gallery/albums/create'} className='px-2 py-1 hover:bg-neutral-800 mb-3 rounded-lg'>
              <i className='fa-solid fa-square-plus p-2'></i>Create album
            </Link>
          </div>
        </div>
        <div className='my-5'>
          <div className='p-4 bg-neutral-900 rounded-3xl'>
            <p className='text-3xl py-2'>Album 1</p>
            <div className='grid grid-cols-1 max-sm:grid-cols-4 md:grid-cols-7 gap-4'>
              {images.map((image, i) => (
                <Link key={i} href={'/gallery/image'}>
                  <img className='aspect-square rounded-lg object-cover' key={i} src={image} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Albums;
