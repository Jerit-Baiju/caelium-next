'use client';
import { Image } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DetailedImage = ({ params }: { params: { slug: string } }) => {
  const api = useAxios();
  const [image, setImage] = useState<Image | null>();
  useEffect(() => {
    const fetchImage = async () => {
      const response = await api.get(`/api/gallery/get/${params.slug}/`);
      setImage(await response.data);
    };
    fetchImage();
  }, []);
  return (
    <div>
      <div className='flex justify-between h-16 absolute z-50 top-0 start-0 w-full p-6'>
        <div className='flex justify-start items-center'>
          <Link href={'/gallery'}>
          <span className='material-symbols-outlined'>arrow_back</span>
          </Link>
        </div>
        <div className='flex justify-end items-center gap-6 text-3xl'>
          <span className='material-symbols-outlined'>share</span>
          <span className='material-symbols-outlined'>info</span>
          <span className='material-symbols-outlined'>star</span>
        </div>
      </div>
      <div className='h-screen w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center'>
        <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]' />
        <img className='h-full max-w-full rounded-lg' src={image?.url} alt='' />
      </div>
    </div>
  );
};

export default DetailedImage;
