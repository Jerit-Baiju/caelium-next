'use client';
import { useNavbar } from '@/contexts/NavContext';
import { Image, NavLink } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Wrapper from '../Wrapper';

const Page = () => {
  const api = useAxios();
  const { setCtaButton, defaultCtaButton, navLinks, setNavLinks } = useNavbar();
  const [images, setImages] = useState([]);
  const [havePermission, setHavePermission] = useState<boolean>(false);
  const [accessURL, setAccessURL] = useState<string>('');
  useEffect(() => {
    setCtaButton({ name: 'Upload', url: 'gallery/upload' });
    const newLinks: NavLink[] = navLinks ? [...navLinks] : [];
    newLinks[0] = { name: 'Albums', url: '/gallery/albums' };
    setNavLinks(newLinks);

    const fetchImages = async () => {
      const response = await api.get('/api/gallery/photos/');
      if (response.status == 200) {
        setImages(response.data);
        setHavePermission(true);
      } else {
        setAccessURL(response.data.url);
      }
    };
    fetchImages();

    return () => {
      setCtaButton(defaultCtaButton);
    };
  }, []);

  return (
    <Wrapper>
      <div className='p-4'>
        {havePermission ? (
          <>
            <p className='text-3xl py-2'>Jan 8, 2024</p>
            <div className='grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-7 gap-4'>
              {images.map((image: Image, i) => (
                <Link key={i} href={`/gallery/image/${image.id}`}>
                  <img className='aspect-square rounded-lg object-cover' key={i} src={image.file} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center'>
            <Link href={'http://127.0.0.1:8000/api/gallery/auth/'} className='bg-neutral-700 border-neutral-600 p-2 border rounded-lg'>
              sync google photos
            </Link>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
