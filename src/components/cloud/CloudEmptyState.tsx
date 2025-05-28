import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiFolder, FiUpload } from 'react-icons/fi';

const CloudEmptyState = () => (
  <div className='flex grow flex-col items-center mt-20 text-center rounded-xl shadow-sm mx-auto w-full'>
    <div className='p-5 rounded-full mb-5'>
      <FiFolder className='w-14 h-14' />
    </div>
    <h3 className='text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200'>This folder is empty</h3>
    <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-6'>
      Upload some files or create a new folder to get started
    </p>
    <div className='flex gap-3'>
      <Link href='/cloud/upload'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center gap-2 bg-gradient-to-br from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium'
        >
          <FiUpload size={18} />
          <span>Upload Files</span>
        </motion.button>
      </Link>
    </div>
  </div>
);

export default CloudEmptyState;
