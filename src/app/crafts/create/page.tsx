'use client';
import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CraftCreate = () => {
  const today = new Date();
  const formattedDate = today.toISOString().substr(0, 10);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(formattedDate);
  const router = useRouter();
  const api = useAxios();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };


  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('banner', banner as File);
    formData.append('content', content);
    formData.append('date', selectedDate);
    try {
      const request = await api.post('/api/crafts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (request.status === 201) {
        router.push(`/crafts/get/${request.data.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col grow items-center justify-center md:p-4 max-sm:min-h-[calc(100dvh-9rem)]'>
      <div className='flex justify-center flex-col items-center sm:w-1/2'>
        <div className='h-full p-8 rounded-lg shadow-md w-full max-sm:w-screen'>
          <form onSubmit={handleSubmit}>
            <h1 className='text-4xl font-bold mb-4 text-center'>
              Craft <i className='fa-solid fa-feather ms-1'></i>
            </h1>
            <input
              value={title}
              type='text'
              className='input input-bordered w-full mb-4'
              placeholder='Enter Title'
              autoComplete='off'
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              autoFocus
              required
            />
            <input
              value={tag}
              type='text'
              className='input input-bordered w-full mb-4'
              placeholder='Enter Tagline'
              autoComplete='off'
              onChange={(e) => {
                setTag(e.target.value);
              }}
              required
            />
            <input
              type='file'
              accept='image/*'
              onChange={handleBannerChange}
              required
              className='file-input mb-4 file-input-bordered w-full'
            />
            <textarea
              className='textarea textarea-bordered w-full h-64 mb-4'
              placeholder='Write your content here'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className='mb-4'>
              <label htmlFor='banner' className='block text-sm font-medium text-gray-700 dark:text-white'>
                Date
              </label>
              <input
                type='date'
                className='mt-1 p-2 w-fit border rounded-md focus:outline-hidden focus:ring-3 focus:border-blue-300 resize-none dark:bg-neutral-800 dark:border-neutral-700 dark:[color-scheme:dark]'
                placeholder='Select date'
                name='date'
                value={selectedDate}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className='flex justify-center'>
              <button
                className='bg-blue-500 w-1/2 rounded-lg hover:bg-blue-600 text-white font-bold py-2 px-4 focus:outline-hidden focus:shadow-outline'
                type='submit'
              >
                Publish <i className='fa-solid fa-upload ms-1'></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CraftCreate;
