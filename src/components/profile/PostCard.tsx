'use client';
import { formatTimeAgo } from '@/helpers/dummyData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiHeart, FiMessageSquare, FiMoreHorizontal } from 'react-icons/fi';

interface PostProps {
  post: {
    id: number;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    createdAt: string;
  };
  user: {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    avatar?: string;
  };
}

const PostCard = ({ post, user }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='rounded-xl bg-white dark:bg-neutral-800 overflow-hidden shadow-sm'>
      {/* Post Image */}
      <div className='relative aspect-square'>
        <img
          src={post.image}
          alt='Post'
          className='w-full h-full object-cover'
          draggable={false} // Prevent image dragging
        />
        <div className='absolute bottom-3 right-3 bg-black/50 text-white py-1 px-2 text-xs rounded-full max-sm:hidden'>
          {formatTimeAgo(post.createdAt)}
        </div>
        <div className='absolute bottom-0 right-0 py-1 px-2 text-xs rounded-full max-lg:hidden max-md:hidden max-sm:block'>
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={handleLike}
            className={`${liked ? 'text-violet-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
            <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Post Footer */}
      <div className='p-3 max-sm:hidden'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleLike}
              className={`${liked ? 'text-violet-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
              <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            <button className='text-neutral-600 dark:text-neutral-400'>
              <FiMessageSquare className='w-5 h-5' />
            </button>
          </div>
          <button className='text-neutral-600 dark:text-neutral-400'>
            <FiMoreHorizontal className='w-5 h-5' />
          </button>
        </div>

        <div className='text-sm font-medium dark:text-white'>{likeCount.toLocaleString()} likes</div>

        <div className='mt-1 text-sm'>
          <span className='font-medium dark:text-white'>{user?.name}</span>
          <span className='text-neutral-700 dark:text-neutral-300'> {post.caption}</span>
        </div>

        {post.comments > 0 && (
          <button className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>View all {post.comments} comments</button>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
