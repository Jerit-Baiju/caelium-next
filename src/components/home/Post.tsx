import AuthContext from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { FiBookmark, FiHeart, FiMessageSquare, FiMoreHorizontal, FiSend } from 'react-icons/fi';

interface PostUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface PostProps {
  post: {
    id: number;
    user: PostUser;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
  };
}

const Post = ({ post }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const tapRef = useRef<HTMLDivElement>(null);

  // Variables for double tap/click detection
  const lastTapTimeRef = useRef<number>(0);
  const tapTimeThreshold = 300; // Threshold time between taps in milliseconds
  const tapPositionRef = useRef({ x: 0, y: 0 });

  // Function for liking/unliking a post with button
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  // Function to handle like action and animation when double-tapping
  const triggerLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }

    // Always show heart animation, even if already liked
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1800); // Extended to match new animation duration
  };

  // Handle double click for desktop browsers
  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    triggerLike();
  };

  // Handle touch events for mobile devices
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) return; // Only handle single touches

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    // Get touch position
    const touch = event.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    // Check if touch is near previous touch
    const position = tapPositionRef.current;
    const distanceX = Math.abs(clientX - position.x);
    const distanceY = Math.abs(clientY - position.y);
    const isNearby = distanceX < 40 && distanceY < 40;

    // If second tap is close enough in time and position
    if (timeSinceLastTap < tapTimeThreshold && timeSinceLastTap > 0 && isNearby) {
      event.preventDefault(); // Prevent default behavior
      triggerLike();
    }

    // Store position and time for next comparison
    tapPositionRef.current = { x: clientX, y: clientY };
    lastTapTimeRef.current = now;
  };

  // Prevent default touch behaviors that might interfere
  const handleTouchEnd = (event: React.TouchEvent) => {
    // Prevent default only if we're in the middle of detecting a potential double tap
    const now = Date.now();
    if (now - lastTapTimeRef.current < tapTimeThreshold) {
      event.preventDefault();
    }
  };

  // Also prevent any touch move during potential double tap to avoid scrolling
  const handleTouchMove = (event: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < tapTimeThreshold) {
      event.preventDefault();
    }
  };

  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-2xl bg-white dark:bg-neutral-800 shadow-xs overflow-hidden'>
      {/* Post Header */}
      <div className='p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-full overflow-hidden'>
            <img src={post.user.avatar} alt={post.user.name} className='h-full w-full object-cover' />
          </div>
          <div>
            <h4 className='font-medium text-sm dark:text-white'>{post.user.name}</h4>
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>
              @{post.user.username} • {post.time}
            </p>
          </div>
        </div>
        <button className='h-8 w-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center'>
          <FiMoreHorizontal className='w-5 h-5 text-neutral-500 dark:text-neutral-400' />
        </button>
      </div>

      {/* Post Content */}
      <div className='px-4 pb-3'>
        <p className='text-neutral-800 dark:text-neutral-200 text-sm'>{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div
          className='w-full relative'
          ref={tapRef}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <img
            src={post.image}
            alt='Post content'
            className='w-full object-cover cursor-pointer'
            style={{ maxHeight: '500px' }}
            draggable={false} // Prevent image dragging on desktop
          />
          {showHeartAnimation && (
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden'>
              {/* Animated particles */}
              <div className='absolute inset-0 flex items-center justify-center'>
                {[...Array(12)].map((_, i) => {
                  // Create heart-shaped distribution points
                  // These points are distributed along the outline of a heart shape
                  const angle = (i / 12) * 2 * Math.PI;
                  const heartX = 16 * Math.pow(Math.sin(angle), 3); // Heart shape parametric equation (x)
                  const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)); // Heart shape (y)

                  // Scale the heart shape to match the size of our heart icon
                  const scaleFactor = 4;
                  const initialX = heartX * scaleFactor;
                  const initialY = heartY * scaleFactor;

                  // Calculate final positions by extending the particles outward
                  const directionX = initialX === 0 ? 0 : initialX / Math.abs(initialX);
                  const directionY = initialY === 0 ? 0 : initialY / Math.abs(initialY);
                  const distance = 140 + (i % 3) * 20; // Vary distances slightly
                  const finalX = initialX + directionX * distance;
                  const finalY = initialY + directionY * distance;

                  return (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full ${
                        i % 3 === 0 ? 'bg-violet-500' : i % 3 === 1 ? 'bg-indigo-400' : 'bg-purple-600'
                      }`}
                      initial={{ x: initialX, y: initialY, opacity: 0 }}
                      animate={{
                        x: finalX,
                        y: finalY,
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1.4 + (i % 5) * 0.1, // Slightly varied durations
                        ease: 'easeOut',
                      }}
                    />
                  );
                })}

                {/* Smaller particles */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * 2 * Math.PI + 0.2; // Offset angle slightly
                  const heartX = 16 * Math.pow(Math.sin(angle), 3);
                  const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));

                  const scaleFactor = 3.5;
                  const initialX = heartX * scaleFactor;
                  const initialY = heartY * scaleFactor;

                  const directionX = initialX === 0 ? 0 : initialX / Math.abs(initialX);
                  const directionY = initialY === 0 ? 0 : initialY / Math.abs(initialY);
                  const distance = 90 + (i % 4) * 15;
                  const finalX = initialX + directionX * distance;
                  const finalY = initialY + directionY * distance;

                  return (
                    <motion.div
                      key={i + 100} // Ensure unique keys
                      className='absolute w-1 h-1 rounded-full bg-indigo-300'
                      initial={{ x: initialX, y: initialY, opacity: 0 }}
                      animate={{
                        x: finalX,
                        y: finalY,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        ease: 'easeOut',
                        delay: 0.1 + (i % 3) * 0.05, // Staggered delays
                      }}
                    />
                  );
                })}
              </div>

              {/* Heart animation */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
                animate={{
                  scale: [0.2, 1.8, 1.5],
                  opacity: [0, 1, 0.8],
                  rotate: [-15, 15, 0],
                }}
                transition={{
                  duration: 1.0,
                  times: [0, 0.6, 1],
                  ease: 'easeInOut',
                }}
                className='relative'>
                <div className='absolute w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 blur-md opacity-70'></div>
                <div className='relative z-10'>
                  <FiHeart className='w-24 h-24 text-white fill-current drop-shadow-lg' />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-1 sm:gap-3'>
            <motion.button
              whileTap={{ scale: 1.3 }}
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                liked ? 'text-violet-500' : 'text-neutral-600 dark:text-neutral-400'
              }`}
              onClick={handleLike}>
              <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className='h-9 w-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400'>
              <FiMessageSquare className='w-5 h-5' />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className='h-9 w-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400'>
              <FiSend className='w-5 h-5' />
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 1.2 }}
            className={`h-9 w-9 rounded-full flex items-center justify-center ${
              saved ? 'text-yellow-500' : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={handleSave}>
            <FiBookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Likes and Comments */}
        <div>
          <p className='text-sm font-medium dark:text-white'>{likeCount.toLocaleString()} likes</p>
          <button className='text-sm text-neutral-500 dark:text-neutral-400 mt-1'>View all {post.comments} comments</button>

          {/* Comment Input */}
          <div className='mt-3 flex items-center gap-2'>
            <div className='h-8 w-8 rounded-full overflow-hidden'>
              <img src={user?.avatar} alt='Your avatar' className='h-full w-full object-cover' />
            </div>
            <input
              type='text'
              placeholder='Add a comment...'
              className='flex-grow bg-transparent text-sm border-none focus:outline-none focus:ring-0 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400'
            />
            <button className='text-violet-600 dark:text-violet-400 text-sm font-medium'>Post</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
