'use client';
import { useNavbar } from '@/contexts/NavContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiSend, FiUser, FiMoreVertical, FiRefreshCw } from 'react-icons/fi';

export default function ChatPage() {
  const {setShowNav} = useNavbar()
  useEffect(() => {
    setShowNav(false)
    return () => {
      setShowNav(true)
    }
  }, []);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there! 👋', sender: 'other' },
    { id: 2, text: 'Hi! How are you?', sender: 'me' },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='min-h-dvh bg-slate-900 text-white'>
      <div className='h-dvh flex flex-col'>
        {/* Header */}
        <div className='p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center'>
              <FiUser className='text-indigo-400' />
            </div>
            <div>
              <h2 className='font-medium'>Random Chat</h2>
              <p className='text-sm text-slate-400'>Connected with a random user</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <button className='p-2 hover:bg-slate-700 rounded-full transition-colors'>
              <FiRefreshCw className='text-slate-400' />
            </button>
            <button className='p-2 hover:bg-slate-700 rounded-full transition-colors'>
              <FiMoreVertical className='text-slate-400' />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial='hidden'
                animate='visible'
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[60%] p-3 rounded-lg ${
                    message.sender === 'me' ? 'bg-indigo-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className='text-sm md:text-base'>{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className='p-4 bg-slate-800 border-t border-slate-700'>
          <form className='flex gap-2'>
            <input
              type='text'
              placeholder='Type your message...'
              className='flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors'
            />
            <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg transition-colors'>
              <FiSend className='text-xl' />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
