import { useChatContext } from '@/contexts/ChatContext';
import { User } from '@/helpers/props';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Typing = () => {
  const { typingMessage, getParticipant } = useChatContext();
  const [typist, setTypist] = useState<User | null>(null);

  useEffect(() => {
    setTypist(typingMessage?.sender ? getParticipant(typingMessage?.sender) : null);
  }, [typingMessage]);

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -5, 0] },
  };

  return (
    typingMessage?.typed && (
      <div className='flex flex-row items-start gap-3 my-6 max-w-[85%] mr-auto'>
        <div className='shrink-0'>
          <div className='relative w-9 h-9'>
            <img
              className='rounded-full w-full h-full object-cover 
                ring-2 ring-white/80 dark:ring-neutral-800
                shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
              alt={typist?.name}
              src={typist?.avatar}
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2 mb-1.5'>
            <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>
              {typist?.name}
            </span>
          </div>
          <div className='rounded-2xl rounded-tl-none px-5 py-3 
            bg-white text-neutral-900 
            dark:bg-neutral-800 dark:text-white 
            border border-neutral-200 dark:border-neutral-700
            transition-colors duration-200
            hover:shadow-md'>
            <div className='flex items-center gap-1'>
              <span className='text-[15px] tracking-[0.01em] font-normal'>{typingMessage?.typed}</span>
              <div className='flex gap-1'>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className='w-1.5 h-1.5 bg-current rounded-full'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Typing;
