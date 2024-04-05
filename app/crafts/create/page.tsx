'use client';
import AuthContext from '@/contexts/AuthContext';
import { getUrl } from '@/helpers/support';
import axios from 'axios';
import { useContext, useState } from 'react';
import Wrapper from '../../Wrapper';

const CraftCreate = () => {
  const today = new Date();
  const formattedDate = today.toISOString().substr(0, 10);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(formattedDate);
  const [space, setSpace] = useState('personal');
  const { authTokens } = useContext(AuthContext);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSpaceChange = (selectedPrivacy: string) => {
    setSpace(selectedPrivacy);
  };
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };

  const privacyOptions = ['personal', 'partner', 'family', 'all'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('banner', banner as File);
    formData.append('content', content);
    formData.append('space', space);
    formData.append('date', selectedDate);
    axios.request(
      getUrl({ url: '/api/crafts/', method: 'POST', data: formData, token: authTokens.access, content_type: 'multipart/form-data' }),
    );
  };

  return (
    <Wrapper>
      <div className='flex flex-grow items-center justify-center  max-sm:h-[calc(100dvh-9rem)]'>
        <div className='flex justify-center flex-col items-center sm:w-1/2'>
          <div className='bg-white h-full dark:bg-neutral-900 p-8 rounded-lg shadow-md w-full max-sm:w-screen'>
            <form onSubmit={handleSubmit}>
              <h1 className='text-4xl font-bold mb-4 text-center'>
                Craft <i className='fa-solid fa-feather ms-1'></i>
              </h1>
              <div className='mb-4'>
                <label htmlFor='title' className='block text-sm font-medium text-neutral-700 dark:text-white'>
                  Title
                </label>
                <input
                  type='text'
                  id='title'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-neutral-800 dark:border-neutral-700'
                  placeholder='Enter title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='title' className='block text-sm font-medium text-neutral-700 dark:text-white'>
                  Tag
                </label>
                <input
                  type='text'
                  id='tag'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-neutral-800 dark:border-neutral-700'
                  placeholder='Enter tagline'
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='banner' className='block text-sm font-medium text-neutral-700 dark:text-white'>
                  Banner Image Upload
                </label>
                <input
                  type='file'
                  accept='image/*'
                  id='banner'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-neutral-800 dark:border-neutral-700'
                  onChange={handleBannerChange}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='content' className='block text-sm font-medium text-neutral-700 dark:text-white'>
                  Content
                </label>
                <textarea
                  id='content'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 h-40 resize-none dark:bg-neutral-800 dark:border-neutral-700'
                  placeholder='Write your content here'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className='mb-4'>
                <label htmlFor='banner' className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Date
                </label>
                <input
                  type='date'
                  className='mt-1 p-2 w-fit border rounded-md focus:outline-none focus:ring focus:border-blue-300 resize-none dark:bg-neutral-800 dark:border-neutral-700'
                  placeholder='Select date'
                  name='date'
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='privacy' className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Space
                </label>
                <div className='mt-1 grid grid-cols-4 gap-4'>
                  {privacyOptions.map((option) => (
                    <button
                      key={option}
                      className={`p-2 rounded-md focus:outline-none ${
                        space === option ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white'
                      }`}
                      onClick={() => handleSpaceChange(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className='flex justify-center'>
                <button
                  className='bg-blue-500 w-1/2 rounded-lg hover:bg-blue-600 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  Publish <i className='fa-solid fa-upload ms-1'></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CraftCreate;
