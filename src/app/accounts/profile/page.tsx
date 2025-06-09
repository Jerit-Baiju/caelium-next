'use client';
import Loader from '@/components/layout/Loader';
import PostCard from '@/components/profile/PostCard';
import AuthContext from '@/contexts/AuthContext';
import { dummyPosts } from '@/helpers/dummyData';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { FiBookmark, FiEdit2, FiGrid, FiSettings, FiTag, FiUser } from 'react-icons/fi';
import { toast } from 'sonner';

const Profile = () => {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    birthdate: user?.birthdate || '',
    avatar: user?.avatar,
  });
  const [activeTab, setActiveTab] = useState('posts');
  const [errors, setErrors] = useState({});
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(user?.avatar);
  const [newData, setNewData] = useState({});
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      email: user?.email || '',
      birthdate: user?.birthdate || '',
      avatar: user?.avatar,
    });
    setAvatarSrc(user?.avatar);
  }, [user]);

  const fields = [
    { name: 'Name', value: profile.name, fieldName: 'name' },
    {
      name: 'Date of Birth',
      value: profile.birthdate instanceof Date ? profile.birthdate.toISOString().split('T')[0] : profile.birthdate || '',
      placeholder: 'Add your date of birth',
      type: 'date',
      fieldName: 'birthdate',
    },
  ];

  const handleInputChange = (fieldName: string, _stateName: string, value: string | number | Date) => {
    setErrors({ ...errors, [fieldName]: null });
    setNewData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    setProfile((prev) => ({ ...prev, [fieldName]: value }));
  };

  const updateProfile = () => {
    api
      .patch(`/api/auth/update/${user?.id}/`, newData)
      .then(() => {
        toast.success('Profile updated successfully.');
        setEditProfileVisible(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
      });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarSrc(URL.createObjectURL(file));
    setProfile((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    try {
      await api.patch(`/api/auth/update/${user?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Avatar updated successfully.');
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  // Stats for user profile
  const stats = [
    { label: 'Posts', value: dummyPosts.length },
    { label: 'Followers', value: 845 },
    { label: 'Following', value: 231 },
  ];

  return user ? (
    <div className='flex grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      {/* Header & Profile Info Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='container mx-auto px-4 py-8 max-w-5xl'>
        {/* Profile Header */}
        <div className='md:flex items-center gap-8'>
          {/* Avatar */}
          <div className='flex justify-center md:justify-normal mb-6 md:mb-0'>
            <div className='relative'>
              {avatarSrc ? (
                <img
                  className='h-28 w-28 md:h-40 md:w-40 rounded-full border-2 border-white dark:border-neutral-700 object-cover'
                  src={avatarSrc}
                  alt={user.name}
                />
              ) : (
                <div className='h-28 w-28 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center border-2 border-white dark:border-neutral-700'>
                  <FiUser className='w-12 h-12 md:w-16 md:h-16 text-violet-500' />
                </div>
              )}
              <button
                onClick={handleEditAvatarClick}
                className='absolute bottom-0 right-0 bg-violet-500 p-1.5 md:p-2 rounded-full text-white hover:bg-violet-600 transition-colors shadow-md'>
                <FiEdit2 className='w-3 h-3 md:w-4 md:h-4' />
              </button>
              <input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} accept='image/*' />
            </div>
          </div>

          {/* Profile Info */}
          <div className='flex-grow'>
            <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-6'>
              <h1 className='text-2xl md:text-3xl font-bold text-center md:text-left dark:text-white'>{profile.name}</h1>
              <div className='flex justify-center md:justify-start gap-2'>
                <button
                  onClick={() => setEditProfileVisible(!editProfileVisible)}
                  className='px-4 md:px-5 py-1.5 md:py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors dark:text-white'>
                  Edit Profile
                </button>
                <Link href={'/accounts/settings'} className='p-1.5 md:p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 transition-colors'>
                  <FiSettings className='w-5 h-5' />
                </Link>
              </div>
            </div>

            {/* Stats - Mobile only shows on larger screens */}
            <div className='hidden md:flex items-center gap-8 mt-6'>
              {stats.map((stat, i) => (
                <div key={i} className='flex flex-col items-center md:items-start'>
                  <span className='font-bold text-lg dark:text-white'>{stat.value.toLocaleString()}</span>
                  <span className='text-neutral-600 dark:text-neutral-400'>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className='mt-4 text-center md:text-left dark:text-white'>
              <p className='text-sm md:text-base'>Photography enthusiast and tech lover exploring the world one photo at a time. ✌️</p>
            </div>
          </div>
        </div>

        {/* Stats - Mobile version */}
        <div className='flex justify-around md:hidden border-y border-neutral-200 dark:border-neutral-800 my-6 py-3'>
          {stats.map((stat, i) => (
            <div key={i} className='flex flex-col items-center'>
              <span className='font-bold dark:text-white'>{stat.value.toLocaleString()}</span>
              <span className='text-xs text-neutral-600 dark:text-neutral-400'>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Edit Profile Form - Conditionally rendered */}
        {editProfileVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md mt-6'>
            <h2 className='text-xl font-semibold mb-4 dark:text-white'>Edit Profile</h2>
            <div className='space-y-4'>
              {fields.map((field, i) => (
                <div key={i} className='space-y-1'>
                  <label className='text-sm text-neutral-500 dark:text-neutral-400'>{field.name}</label>
                  <input
                    type={field.type || 'text'}
                    className='w-full p-2.5 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:text-white'
                    value={field.value || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleInputChange(field.fieldName, field.name, e.target.value)}
                  />
                  {errors[field.fieldName as keyof typeof errors] && (
                    <p className='text-sm text-red-500'>{(errors[field.fieldName as keyof typeof errors] as string[])[0]}</p>
                  )}
                </div>
              ))}
              <div className='flex justify-end gap-2 mt-4'>
                <button
                  onClick={() => setEditProfileVisible(false)}
                  className='px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'>
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  className='px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors'>
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <div className='border-t border-neutral-200 dark:border-neutral-800 mt-8'>
          <div className='flex justify-around md:justify-center md:gap-12'>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-violet-500 text-violet-500'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400'
              }`}>
              <FiGrid className='w-4 h-4' />
              <span className='text-sm font-medium'>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-violet-500 text-violet-500'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400'
              }`}>
              <FiBookmark className='w-4 h-4' />
              <span className='text-sm font-medium'>Saved</span>
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors ${
                activeTab === 'tagged'
                  ? 'border-violet-500 text-violet-500'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400'
              }`}>
              <FiTag className='w-4 h-4' />
              <span className='text-sm font-medium'>Tagged</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className='mt-6'>
          {activeTab === 'posts' && (
            <>
              {dummyPosts.length > 0 ? (
                <div className='grid grid-cols-3 gap-1 md:gap-4'>
                  {dummyPosts.map((post) => (
                    <PostCard key={post.id} post={post} user={user} />
                  ))}
                </div>
              ) : (
                <div className='py-12 text-center'>
                  <div className='inline-flex justify-center items-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4'>
                    <FiGrid className='w-10 h-10 text-neutral-400' />
                  </div>
                  <h3 className='text-xl font-semibold dark:text-white'>No Posts Yet</h3>
                  <p className='text-neutral-500 dark:text-neutral-400 mt-2'>When you share photos, they&apos;ll appear here.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <div className='py-12 text-center'>
              <div className='inline-flex justify-center items-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4'>
                <FiBookmark className='w-10 h-10 text-neutral-400' />
              </div>
              <h3 className='text-xl font-semibold dark:text-white'>No Saved Posts</h3>
              <p className='text-neutral-500 dark:text-neutral-400 mt-2'>Save photos to revisit them later.</p>
            </div>
          )}

          {activeTab === 'tagged' && (
            <div className='py-12 text-center'>
              <div className='inline-flex justify-center items-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4'>
                <FiTag className='w-10 h-10 text-neutral-400' />
              </div>
              <h3 className='text-xl font-semibold dark:text-white'>No Tagged Posts</h3>
              <p className='text-neutral-500 dark:text-neutral-400 mt-2'>When people tag you in photos, they&apos;ll appear here.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  ) : (
    <div className='flex h-screen items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Profile;
