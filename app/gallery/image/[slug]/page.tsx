'use client';
import { Image } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DetailedImage = ({ params }: { params: { slug: string } }) => {
  const api = useAxios();
  const router = useRouter();
  const [image, setImage] = useState<Image | null>();
  useEffect(() => {
    const fetchImage = async () => {
      const response = await api.get(`/api/gallery/get/${params.slug}/`);
      setImage(await response.data);
    };
    fetchImage();
  }, []);
  return (
    <div className='h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.3] bg-dot-black/[0.3] relative flex items-center justify-center'>
      <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
      <nav className='flex justify-between h-16 fixed w-full z-40 top-0 start-0 p-6'>
        <div className='flex justify-start items-center text-xl'>
          <button
            onClick={() => {
              router.back();
            }}
          >
            <span className='material-symbols-outlined'>arrow_back</span>
          </button>
        </div>
        <div className='flex justify-end items-center text-xl gap-6'>
          <span className='material-symbols-outlined'>share</span>
          <span className='material-symbols-outlined'>info</span>
          <i className='fa-regular fa-star'></i>
          <span className='material-symbols-outlined'>delete</span>
          <i className='fa-solid fa-ellipsis-vertical'></i>
        </div>
      </nav>
      <img className='md:h-full max-sm:w-full max-w-full rounded-lg m-4 object-cover' src={image?.url} alt='' />
      <button
        type='button'
        className='absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
      >
        <span className='material-symbols-outlined text-neutral-600'>arrow_back_ios</span>
      </button>
      <button
        type='button'
        className='absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
      >
        <span className='material-symbols-outlined text-neutral-600'>arrow_forward_ios</span>
      </button>
    </div>
  );
};

export default DetailedImage;
