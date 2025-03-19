'use client';
import { motion } from 'framer-motion';
import { FiFile, FiGrid, FiHardDrive, FiImage, FiShare2, FiStar, FiUpload } from 'react-icons/fi';

const CloudDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const cardHoverVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className='flex flex-col lg:flex-row gap-6 p-6 lg:p-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='p-6  mx-auto space-y-8'>
        {/* Header */}
        <motion.div className='flex justify-between items-center' variants={itemVariants}>
          <div>
            <h1 className='text-3xl font-bold dark:text-neutral-100'>My Cloud</h1>
            <p className='text-neutral-600 dark:text-neutral-400'>Manage your files and storage</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'>
              <FiUpload className='mr-2' />
              <span>Upload Files</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4' variants={itemVariants}>
          {[
            { name: 'All Files', icon: FiGrid, color: 'blue' },
            { name: 'Photos', icon: FiImage, color: 'purple' },
            { name: 'Documents', icon: FiFile, color: 'emerald' },
            { name: 'Favorites', icon: FiStar, color: 'amber' },
            { name: 'Shared', icon: FiShare2, color: 'rose' },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center cursor-pointer'
              variants={cardHoverVariants}
              whileHover='hover'
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.1, duration: 0.3 },
              }}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`w-12 h-12 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center mb-3`}
              >
                <item.icon className={`text-${item.color}-600 dark:text-${item.color}-400 text-xl`} />
              </motion.div>
              <span className='text-sm font-medium dark:text-neutral-200'>{item.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Storage Overview */}
        <motion.div className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
          <h2 className='text-xl font-semibold mb-4 dark:text-neutral-200'>Storage Overview</h2>
          <div className='flex items-center mb-2'>
            <div className='w-full'>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-gradient-to-r from-neutral-600 to-neutral-500 dark:from-neutral-500 dark:to-neutral-400 rounded-full'
                  style={{ width: '0%' }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                ></motion.div>
              </div>
            </div>
            <motion.span
              className='ml-4 font-medium dark:text-neutral-200'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              35%
            </motion.span>
          </div>
          <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-4'>3.5 GB of 10 GB used</p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
            {[
              { type: 'Images', icon: FiImage, amount: '1.2 GB', color: 'blue' },
              { type: 'Documents', icon: FiFile, amount: '0.8 GB', color: 'emerald' },
              { type: 'Other', icon: FiHardDrive, amount: '1.5 GB', color: 'violet' },
            ].map((item, index) => (
              <motion.div
                key={item.type}
                className={`flex items-center p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5 + index * 0.2, duration: 0.3 },
                }}
                whileHover={{ y: -2, boxShadow: '0 5px 10px rgba(0,0,0,0.1)' }}
              >
                <motion.div className='p-2 bg-neutral-200 dark:bg-neutral-700 rounded-md mr-3' whileHover={{ rotate: 10 }}>
                  <item.icon className='text-neutral-600 dark:text-neutral-300' />
                </motion.div>
                <div>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>{item.type}</p>
                  <p className='font-medium dark:text-neutral-200'>{item.amount}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Files & Activity */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Recent Files */}
          <motion.div className='md:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold dark:text-neutral-200'>Recent Files</h2>
              <motion.button className='text-neutral-600 dark:text-neutral-400 text-sm font-medium' whileHover={{ x: 3 }}>
                View All
              </motion.button>
            </div>
            <div className='space-y-3'>
              {[
                { name: 'Presentation.pptx', type: FiFile, size: '4.2 MB', time: '2 hours ago', color: 'blue' },
                { name: 'Vacation-Photo.jpg', type: FiImage, size: '2.8 MB', time: 'Yesterday', color: 'emerald' },
                { name: 'Report-Q2.pdf', type: FiFile, size: '8.5 MB', time: '2 days ago', color: 'rose' },
                { name: 'Meeting-Notes.docx', type: FiFile, size: '1.2 MB', time: '3 days ago', color: 'neutral' },
              ].map((file, index) => (
                <motion.div
                  key={file.name}
                  className='flex items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition cursor-pointer'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.8 + index * 0.1, duration: 0.3 },
                  }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className={`p-2 bg-${file.color}-100 dark:bg-${file.color}-900/30 rounded-md mr-3`}
                    whileHover={{ rotate: 10 }}
                  >
                    <file.type className={`text-${file.color}-600 dark:text-${file.color}-400`} />
                  </motion.div>
                  <div className='flex-grow'>
                    <p className='font-medium dark:text-neutral-200'>{file.name}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                      {file.size} • {file.time}
                    </p>
                  </div>
                  <motion.button
                    className='text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FiShare2 />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold dark:text-neutral-200'>Activity</h2>
              <motion.button className='text-neutral-600 dark:text-neutral-400 text-sm font-medium' whileHover={{ x: 3 }}>
                View All
              </motion.button>
            </div>
            <div className='relative'>
              <motion.div
                className='absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700'
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              ></motion.div>
              <div className='space-y-6'>
                {[
                  { action: 'You uploaded Report-Q2.pdf', time: '2 hours ago', color: 'blue' },
                  { action: 'You created folder Projects', time: 'Yesterday', color: 'amber' },
                  { action: 'You shared Presentation.pptx', time: '3 days ago', color: 'purple' },
                  { action: 'You updated Meeting-Notes.docx', time: '4 days ago', color: 'emerald' },
                ].map((activity, index) => (
                  <motion.div
                    key={activity.action}
                    className='relative pl-8'
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 1 + index * 0.15, duration: 0.4 },
                    }}
                  >
                    <motion.div
                      className={`absolute left-0 p-1.5 bg-${activity.color}-500 dark:bg-${activity.color}-600/80 rounded-full z-10`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.15, type: 'spring' }}
                    ></motion.div>
                    <p className='text-sm font-medium dark:text-neutral-200'>{activity.action}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>{activity.time}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CloudDashboard;