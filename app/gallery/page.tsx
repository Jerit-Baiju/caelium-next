'use client';
import Loader from '@/components/Loader';
import { useNavbar } from '@/contexts/NavContext';
import { NavLink } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Wrapper from '../Wrapper';

const Page = () => {
  interface Image {
    id: string;
    url: string;
    filename: string;
    timestamp: Date;
  }

  const api = useAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const { setCtaButton, defaultCtaButton, navLinks, setNavLinks } = useNavbar();
  const [images, setImages] = useState<Image[] | null>(null);
  const [havePermission, setHavePermission] = useState<boolean>(false);
  const [accessURL, setAccessURL] = useState<string>('');

  useEffect(() => {
    setCtaButton({ name: 'Upload', url: 'gallery/upload' });
    const newLinks: NavLink[] = navLinks ? [...navLinks] : [];
    newLinks[0] = { name: 'Albums', url: '/gallery/albums' };
    setNavLinks(newLinks);

    const fetchImages = async () => {
      const response = await api.get('/api/gallery/');
      if (response.status == 200) {
        setImages(response.data);
        setLoading(false);
        setHavePermission(true);
        console.log(response.data);
      } else {
        setAccessURL(response.data.url);
      }
    };

    fetchImages();

    return () => {
      setCtaButton(defaultCtaButton);
    };
  }, []);

  return loading ? (
    <Wrapper>
      <div className='flex items-center justify-center h-[calc(100dvh-9rem)]'>
        <Loader />
      </div>
    </Wrapper>
  ) : (
    <Wrapper>
      <div className='p-4'>
        {havePermission ? (
          <>
            <p className='text-3xl py-2'>Jan 8, 2024</p>
            <div className='grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-7 gap-4'>
              {images?.map((image: Image, i) => (
                <Link key={i} href={`/gallery/image/${image.id}`}>
                  <img className='aspect-square rounded-lg object-cover' key={i} src={image.url} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center'>
            <Link href={accessURL} className='bg-neutral-700 border-neutral-600 p-2 border rounded-lg'>
              sync google photos
            </Link>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
