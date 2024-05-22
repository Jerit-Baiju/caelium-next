'use client';
import { useNavbar } from '@/contexts/NavContext';
import { NavLink } from '@/helpers/props';
import Link from 'next/link';
import { useEffect } from 'react';
import Wrapper from '../Wrapper';

const page = () => {
  const { setCtaButton, defaultCtaButton, navLinks, setNavLinks } = useNavbar();
  useEffect(() => {
    setCtaButton({ name: 'Create Event', url: 'calendar/create' });
    const newLinks: NavLink[] = navLinks ? [...navLinks] : [];
    newLinks[0] = { name: 'Albums', url: '/gallery/albums' };
    setNavLinks(newLinks);
    return () => {
      setCtaButton(defaultCtaButton);
    };
  }, []);

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
        <p className='text-3xl py-2'>Jan 8, 2024</p>
        <div className='grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-5 gap-4'>
          {images.map((image, i) => (
            <Link key={i} href={'/gallery/image'}>
              <img className='w-full md:h-72 h-full sm:h-40 rounded-lg object-cover' key={i} src={image} />
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
