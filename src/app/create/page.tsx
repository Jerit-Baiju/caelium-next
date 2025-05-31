'use client';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import AuthContext from '@/contexts/AuthContext';
import { User } from '@/helpers/props';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { FiArrowLeft, FiImage, FiMessageSquare, FiPlus, FiSearch, FiUserPlus, FiX } from 'react-icons/fi';

const CreatePostPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useContext(AuthContext);

  // Dummy users for tagging
  const dummyUsers: User[] = [
    {
      id: 1,
      email: 'john@example.com',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      username: 'johndoe',
      last_seen: new Date(),
      birthdate: new Date(),
      location: 'New York',
      gender: 'male',
    },
    {
      id: 2,
      email: 'jane@example.com',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      username: 'janesmith',
      last_seen: new Date(),
      birthdate: new Date(),
      location: 'Los Angeles',
      gender: 'female',
    },
    {
      id: 3,
      email: 'alex@example.com',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      username: 'alexjohnson',
      last_seen: new Date(),
      birthdate: new Date(),
      location: 'Chicago',
      gender: 'non-binary',
    },
    {
      id: 4,
      email: 'sarah@example.com',
      name: 'Sarah Williams',
      avatar: 'https://i.pravatar.cc/150?img=4',
      username: 'sarahw',
      last_seen: new Date(),
      birthdate: new Date(),
      location: 'Miami',
      gender: 'female',
    },
    {
      id: 5,
      email: 'mike@example.com',
      name: 'Mike Brown',
      avatar: 'https://i.pravatar.cc/150?img=5',
      username: 'mikebrown',
      last_seen: new Date(),
      birthdate: new Date(),
      location: 'Seattle',
      gender: 'male',
    },
  ];

  // State management
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setStep('preview');
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setStep('select');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle post submission
  const handleSubmitPost = async () => {
    setIsSubmitting(true);

    // Mock API call - will be implemented later
    setTimeout(() => {
      // Handle success
      router.push('/');
    }, 1000);
  };

  return (
    <main className='flex grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      <div className='w-full max-w-3xl mx-auto px-4 py-6'>
        <header className='flex items-center justify-between mb-6'>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className='flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800'>
            <FiArrowLeft className='w-5 h-5 text-neutral-800 dark:text-neutral-200' />
          </motion.button>
          <h1 className='text-xl font-semibold text-center text-neutral-800 dark:text-white'>
            {step === 'select' ? 'Create New Post' : 'Finalize Post'}
          </h1>
          <div className='w-10'></div> {/* For balance */}
        </header>

        {step === 'select' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-xs min-h-[60vh]'>
            <div className='p-4 rounded-full bg-linear-to-br from-violet-500/20 to-purple-500/20 mb-4'>
              <FiImage className='w-10 h-10 text-violet-600 dark:text-violet-400' />
            </div>
            <h2 className='text-xl font-medium mb-2 text-neutral-800 dark:text-white'>Select an Image</h2>
            <p className='text-neutral-500 dark:text-neutral-400 text-center mb-6'>
              Choose a photo from your device to share with your followers
            </p>
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageSelect} />
            <div className='flex flex-col sm:flex-row gap-4'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className='px-6 py-3 bg-linear-to-br from-violet-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2'>
                <FiImage className='w-5 h-5' />
                Select from Gallery
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col bg-white dark:bg-neutral-800 rounded-2xl shadow-xs overflow-hidden'>
            {/* User Info */}
            <div className='px-4 py-3 border-b dark:border-neutral-700'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-full overflow-hidden'>
                  <img src={user?.avatar} alt={user?.name} className='w-full h-full object-cover' />
                </div>
                <div>
                  <p className='text-sm font-medium dark:text-white'>{user?.name}</p>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>@{user?.username}</p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className='relative'>
              <div className='h-[400px] overflow-hidden'>
                {selectedImage && <img src={selectedImage} alt='Preview' className='w-full h-full object-cover' />}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveImage}
                className='absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white'>
                <FiX className='w-5 h-5' />
              </motion.button>
            </div>

            {/* Post Details Form */}
            <div className='p-6'>
              <div className='mb-6'>
                <label htmlFor='caption' className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                  Write a caption
                </label>
                <textarea
                  id='caption'
                  rows={3}
                  placeholder="What's on your mind?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none'
                />
              </div>

              {/* Post Options */}
              <div className='mb-8'>
                <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>Post settings</h3>
                <div className='flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-neutral-700'>
                  <div className='flex items-center gap-3'>
                    <FiMessageSquare className='w-5 h-5 text-neutral-700 dark:text-neutral-300' />
                    <span className='text-neutral-800 dark:text-neutral-200'>Turn off comments</span>
                  </div>
                  <Switch checked={disableComments} onCheckedChange={setDisableComments} />
                </div>
              </div>

              {/* Tagged Users */}
              <div className='mb-6'>
                <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>Tagged users</h3>
                <div className='flex flex-wrap gap-2'>
                  {taggedUsers.map((taggedUser) => (
                    <Badge key={taggedUser.id} variant='outline' className='flex items-center gap-2'>
                      <div className='h-6 w-6 rounded-full overflow-hidden'>
                        <img src={taggedUser.avatar} alt={taggedUser.name} className='w-full h-full object-cover' />
                      </div>
                      <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>{taggedUser.name}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTaggedUsers(taggedUsers.filter((u) => u.id !== taggedUser.id))}
                        className='text-neutral-500 dark:text-neutral-400'>
                        <FiX className='w-4 h-4' />
                      </motion.button>
                    </Badge>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTagDialogOpen(true)}
                    className='px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 flex items-center gap-2'>
                    <FiUserPlus className='w-5 h-5' />
                    Add Tags
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitPost}
                disabled={isSubmitting}
                className='w-full py-3 bg-linear-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed'>
                {isSubmitting ? 'Posting...' : 'Share Post'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tag Users Dialog */}
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogTrigger asChild>
            <div></div>
          </DialogTrigger>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Tag Users</DialogTitle>
            </DialogHeader>
            <div className='mt-4'>
              <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-4'>
                Start typing a username to tag users in your post. They will be notified when you share the post.
              </p>
              {/* Search bar */}
              <div className='relative mb-4'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500'
                />
              </div>
              <div className='flex flex-col gap-2'>
                {dummyUsers
                  .filter((u) => 
                    !taggedUsers.find((t) => t.id === u.id) && 
                    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((user) => (
                    <motion.button
                      key={user.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTaggedUsers([...taggedUsers, user])}
                      className='flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'>
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-full overflow-hidden'>
                          <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                        </div>
                        <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>{user.name}</span>
                      </div>
                      <FiPlus className='w-5 h-5 text-neutral-500 dark:text-neutral-400' />
                    </motion.button>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default CreatePostPage;
