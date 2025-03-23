'use client';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { FiArrowLeft, FiCheck, FiFile, FiGrid, FiList, FiLock, FiUpload, FiX } from 'react-icons/fi';

const CloudUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const api = useAxios();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid'); // Changed default to 'grid'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create a single FormData instance for all files
      const formData = new FormData();
      
      // Add all files with the field name "files" (must match Django API expectation)
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      // Add parent directory if needed
      formData.append('parent', ''); // Root directory by default

      // Upload all files in a single request
      await api.post('/api/cloud/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Apply the same progress to all files
            const updatedProgress: Record<string, number> = {};
            selectedFiles.forEach(file => {
              updatedProgress[file.name] = percentCompleted;
            });
            setUploadProgress(prev => ({ ...prev, ...updatedProgress }));
          }
        },
      });

      // Mark all files as completed
      const completedProgress: Record<string, number> = {};
      selectedFiles.forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(prev => ({ ...prev, ...completedProgress }));

      toast({
        title: 'Upload complete',
        description: 'Your files have been uploaded successfully',
        variant: 'default',
      });

      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/cloud');
      }, 1500);

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files',
        variant: 'destructive',
      });

      // Mark all files as failed
      const failedProgress: Record<string, number> = {};
      selectedFiles.forEach(file => {
        failedProgress[file.name] = -1;
      });
      setUploadProgress(prev => ({ ...prev, ...failedProgress }));
    } finally {
      setUploading(false);
    }
  };

  const getFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Helper to check if file is an image
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  return (
    <motion.div className='flex grow flex-col gap-6 p-6 lg:p-8' initial='hidden' animate='visible' variants={containerVariants}>
      <div className='flex flex-col grow p-6 mx-auto space-y-8 w-full max-w-7xl'>
        {/* Header */}
        <motion.div className='flex justify-between items-center' variants={itemVariants}>
          <div className='flex items-center gap-4'>
            <Link href='/cloud' className='text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'>
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className='text-3xl font-bold dark:text-neutral-100'>Upload Files</h1>
              <p className='text-neutral-600 dark:text-neutral-400'>Upload files to your secure cloud storage</p>
            </div>
          </div>
        </motion.div>

        {/* File Drop Area */}
        <motion.div
          className='w-full bg-white dark:bg-neutral-800 rounded-xl p-8 mb-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700'
          variants={itemVariants}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center justify-center'>
            <div className='p-4 bg-neutral-100 dark:bg-neutral-700 rounded-full mb-4'>
              <FiUpload className='h-8 w-8 text-neutral-600 dark:text-neutral-300' />
            </div>
            <h3 className='text-lg font-medium dark:text-neutral-200 mb-2'>Drag and drop files here</h3>
            <p className='text-neutral-500 dark:text-neutral-400 text-sm mb-4 text-center'>
              Your files will be encrypted automatically for maximum security
            </p>
            <div className='flex items-center gap-3'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2 rounded-lg transition'
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedFiles.length === 0 || uploading}
                className={`px-5 py-2 rounded-lg transition ${
                  selectedFiles.length === 0 || uploading
                    ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                    : 'bg-linear-to-br from-violet-500 to-purple-500 text-white'
                }`}
                onClick={handleUpload}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </motion.button>
            </div>
            <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' multiple />
          </div>
        </motion.div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <motion.div className='bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm' variants={itemVariants}>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium dark:text-neutral-200 flex items-center'>
                <FiLock className='mr-2' /> Selected Files ({selectedFiles.length})
              </h3>
              <div className='flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1'>
                <button 
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' 
                    ? 'bg-white dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <FiList size={16} />
                </button>
                <button 
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' 
                    ? 'bg-white dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <FiGrid size={16} />
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className='space-y-3'>
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    className='flex items-center p-3 bg-neutral-50 dark:bg-neutral-700/40 rounded-lg'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isImageFile(file) ? (
                      <div className='w-12 h-12 mr-3 rounded-md overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-600'>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name} 
                          className='w-full h-full object-cover'
                          onLoad={(e) => {
                            // Clean up the object URL when the image loads
                            return () => URL.revokeObjectURL((e.target as HTMLImageElement).src);
                          }}
                        />
                      </div>
                    ) : (
                      <div className='p-2 bg-neutral-200 dark:bg-neutral-600 rounded-md mr-3'>
                        <FiFile className='text-neutral-600 dark:text-neutral-300' />
                      </div>
                    )}
                    <div className='flex-grow'>
                      <p className='font-medium dark:text-neutral-200 text-sm truncate max-w-xs'>{file.name}</p>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>{getFileSize(file.size)}</p>
                    </div>

                    {/* Progress indicator */}
                    {uploadProgress[file.name] !== undefined && (
                      <div className='w-24 mr-3'>
                        {uploadProgress[file.name] === -1 ? (
                          <span className='text-red-500 text-xs'>Failed</span>
                        ) : uploadProgress[file.name] === 100 ? (
                          <div className='flex items-center text-green-500 dark:text-green-400'>
                            <FiCheck className='mr-1' />
                            <span className='text-xs'>Complete</span>
                          </div>
                        ) : (
                          <div className='w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-1.5'>
                            <div className='bg-violet-500 h-1.5 rounded-full' style={{ width: `${uploadProgress[file.name]}%` }} />
                          </div>
                        )}
                      </div>
                    )}

                    {!uploading && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400'
                        onClick={() => handleRemoveFile(index)}
                      >
                        <FiX />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    className='flex flex-col bg-neutral-50 dark:bg-neutral-700/40 rounded-lg overflow-hidden'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className='relative pt-[100%] bg-neutral-200 dark:bg-neutral-600'>
                      {isImageFile(file) ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name} 
                          className='absolute top-0 left-0 w-full h-full object-cover'
                          onLoad={(e) => {
                            // Clean up the object URL when the image loads
                            return () => URL.revokeObjectURL((e.target as HTMLImageElement).src);
                          }}
                        />
                      ) : (
                        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                          <FiFile size={32} className='text-neutral-600 dark:text-neutral-300' />
                        </div>
                      )}
                      
                      {uploadProgress[file.name] !== undefined && (
                        <div className='absolute bottom-0 left-0 right-0 bg-black/20 p-1'>
                          {uploadProgress[file.name] === -1 ? (
                            <div className='text-red-500 text-xs text-center'>Failed</div>
                          ) : uploadProgress[file.name] === 100 ? (
                            <div className='flex items-center justify-center text-green-500 dark:text-green-400 text-xs'>
                              <FiCheck className='mr-1' />
                              <span>Complete</span>
                            </div>
                          ) : (
                            <div className='w-full bg-neutral-200/60 dark:bg-neutral-600/60 rounded-full h-1.5'>
                              <div className='bg-violet-500 h-1.5 rounded-full' style={{ width: `${uploadProgress[file.name]}%` }} />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!uploading && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500/80'
                          onClick={() => handleRemoveFile(index)}
                        >
                          <FiX size={14} />
                        </motion.button>
                      )}
                    </div>
                    <div className='p-3'>
                      <p className='font-medium dark:text-neutral-200 text-sm truncate'>{file.name}</p>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>{getFileSize(file.size)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className='mt-4 text-xs text-neutral-500 dark:text-neutral-400 flex items-center'>
              <FiLock className='mr-1' /> Files will be encrypted before upload for your security
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CloudUpload;
