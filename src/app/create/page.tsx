'use client';
import PostTagModal from '@/components/home/PostTagModal';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AuthContext from '@/contexts/AuthContext';
import { User } from '@/helpers/props';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { FiArrowLeft, FiImage, FiMessageSquare, FiUserPlus, FiX } from 'react-icons/fi';

// Caption character limit constant
const CAPTION_MAX_LENGTH = 200;

const CreatePostPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useContext(AuthContext);

  // State management
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  // Check if caption exceeds the character limit
  const isExceedingLimit = caption.length > CAPTION_MAX_LENGTH;

  // Handle when users are selected in the tag dialog
  const handleUserTagging = (selectedUsers: User[]) => {
    setTaggedUsers(selectedUsers);
  };

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
    // Validate caption length
    if (caption.length > CAPTION_MAX_LENGTH) {
      // You could show a toast notification here
      return;
    }

    setIsSubmitting(true);

    // Mock API call - will be implemented later
    setTimeout(() => {
      // Handle success
      router.push('/');
    }, 1000);
  };

  return (
    <main className='flex grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      <div className='w-full max-w-6xl mx-auto px-4 py-6'>
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
            className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-xs overflow-hidden p-4'>
            {/* Left Column - Image Preview */}
            <div className='flex flex-col'>
              {/* User Info */}
              <div className='px-4 py-3 dark:border-neutral-700'>
                <div className='flex items-center gap-3'>
                  <div className='h-12 w-12 rounded-full overflow-hidden'>
                    <img src={user?.avatar} alt={user?.name} className='w-full h-full object-cover' />
                  </div>
                  <div>
                    <p className='font-medium dark:text-white'>{user?.name}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>@{user?.username}</p>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div className='relative flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] md:h-full'>
                {selectedImage && (
                  <div className='image-preview-container h-full flex items-center justify-center rounded-2xl overflow-hidden'>
                    <img src={selectedImage} alt='Preview' className='w-full h-full rounded-2xl object-cover' />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRemoveImage}
                      className='absolute top-3 right-3 p-2 bg-neutral-800/70 rounded-full text-white hover:bg-neutral-900/80 transition-colors'>
                      <FiX className='w-5 h-5' />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Post Details Form */}
            <div className='p-6 flex flex-col'>
              <div className='mb-6'>
                <Label htmlFor='caption' className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                  Write a caption
                </Label>
                <div className='relative'>
                  <textarea
                    id='caption'
                    rows={5}
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none resize-none ${
                      isExceedingLimit ? 'border-1 border-red-500' : 'focus:ring-1'
                    }`}
                  />
                  <div
                    className={`absolute bottom-2 right-3 text-xs font-medium ${
                      isExceedingLimit ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'
                    }`}>
                    {caption.length}/{CAPTION_MAX_LENGTH} chars
                  </div>
                </div>
              </div>

              {/* Tagged Users */}
              <div className='mb-6'>
                <Label className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>People in this post</Label>
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
                    Tag People
                  </motion.button>
                </div>
              </div>

              {/* Post Options */}
              <div className='mb-auto'>
                <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>Post settings</h3>
                <div className='flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-neutral-700'>
                  <div className='flex items-center gap-3'>
                    <FiMessageSquare className='w-5 h-5 text-neutral-700 dark:text-neutral-300' />
                    <span className='text-neutral-800 dark:text-neutral-200'>Turn off comments</span>
                  </div>
                  <Switch checked={disableComments} onCheckedChange={setDisableComments} />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitPost}
                disabled={isSubmitting}
                className='w-full py-3 mt-6 bg-linear-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed'>
                {isSubmitting ? 'Posting...' : 'Share Post'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Post Tag Modal */}
        <PostTagModal
          isOpen={isTagDialogOpen}
          onClose={() => setIsTagDialogOpen(false)}
          onUserTagApply={handleUserTagging}
          selectedUsers={taggedUsers}
        />
      </div>
    </main>
  );
};

export default CreatePostPage;
