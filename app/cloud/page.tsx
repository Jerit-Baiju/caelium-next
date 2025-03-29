'use client';

import { BreadcrumbItem, ExplorerData, FileData } from '@/helpers/props';
import useCloud from '@/hooks/useCloud';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiArchive,
  FiChevronRight,
  FiCode,
  FiFile,
  FiFileText,
  FiFolder,
  FiHome,
  FiImage,
  FiMusic,
  FiUpload,
  FiVideo,
} from 'react-icons/fi';

const CloudExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatFileSize, fetchExplorerData, fetchImageUrls, getFileThumbnailType } = useCloud();
  const [loading, setLoading] = useState(true);
  const [explorerData, setExplorerData] = useState<ExplorerData>({
    directories: [],
    files: [],
    breadcrumbs: [],
    current_directory: null,
  });

  // Use useRef to persist the image cache between directory navigations
  const imageUrlsCacheRef = useRef<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [currentPath, setCurrentPath] = useState<string>(searchParams?.get('dir') || '');

  // Drag and drop upload states
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchExplorerData(currentPath);
        setExplorerData(data);
      } catch (error) {
        console.error('Error fetching explorer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPath]);

  // Add event listeners for drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only set isDragging to false if we're leaving the document
      // This prevents flicker when moving between elements
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isDragging]);

  useEffect(() => {
    // Initialize imageUrls from cache for current files
    const cachedUrls: Record<string, string> = {};
    const filesToFetch: FileData[] = [];

    // For each file that needs a thumbnail, check if it's in cache
    explorerData.files
      .filter((file) => getFileThumbnailType(file) === 'image')
      .forEach((file) => {
        if (imageUrlsCacheRef.current[file.id]) {
          cachedUrls[file.id] = imageUrlsCacheRef.current[file.id];
        } else {
          filesToFetch.push(file);
        }
      });

    // Set initial cached URLs
    if (Object.keys(cachedUrls).length > 0) {
      setImageUrls(cachedUrls);
    }

    // Fetch uncached images in batches of 5
    const loadImageThumbnails = async () => {
      if (filesToFetch.length === 0) return;

      // Process files in batches of 5
      for (let i = 0; i < filesToFetch.length; i += 5) {
        const batch = filesToFetch.slice(i, i + 5);
        try {
          const urls = await fetchImageUrls(batch);
          if (urls) {
            // Update both the current state and the persistent cache for each image
            Object.entries(urls).forEach(([fileId, url]) => {
              setImageUrls((prevUrls) => ({
                ...prevUrls,
                [fileId]: url
              }));
              
              // Update the persistent cache ref
              imageUrlsCacheRef.current = {
                ...imageUrlsCacheRef.current,
                [fileId]: url,
              };
            });
          }
        } catch (error) {
          console.error(`Error loading thumbnails for batch ${i/5 + 1}:`, error);
        }
      }
    };

    loadImageThumbnails();
  }, [explorerData.files]);

  const renderThumbnail = (file: FileData) => {
    const thumbnailType = getFileThumbnailType(file);
    const typeToIcon = {
      image: { icon: FiImage, color: 'text-neutral-400 dark:text-neutral-500' },
      video: { icon: FiVideo, color: 'text-blue-400 dark:text-blue-300' },
      audio: { icon: FiMusic, color: 'text-purple-400 dark:text-purple-300' },
      pdf: { icon: FiFileText, color: 'text-red-400 dark:text-red-300' },
      archive: { icon: FiArchive, color: 'text-amber-400 dark:text-amber-300' },
      code: { icon: FiCode, color: 'text-emerald-400 dark:text-emerald-300' },
      file: { icon: FiFile, color: 'text-neutral-400 dark:text-neutral-500' },
      default: { icon: FiFile, color: 'text-neutral-400 dark:text-neutral-500' },
    };

    const { icon: Icon, color } = typeToIcon[thumbnailType as keyof typeof typeToIcon] || typeToIcon.default;

    // Check both current imageUrls and the persistent cache
    if (thumbnailType === 'image' && (imageUrls[file.id] || imageUrlsCacheRef.current[file.id])) {
      const imageUrl = imageUrls[file.id] || imageUrlsCacheRef.current[file.id];
      return <img src={imageUrl} alt={file.name} className='w-full h-full object-cover rounded-md' />;
    }

    return (
      <div className={`flex justify-center items-center h-full w-full ${color}`}>
        <Icon size={52} />
      </div>
    );
  };

  const navigateToDirectory = (dirId: string) => {
    const params = new URLSearchParams();
    if (dirId) params.set('dir', dirId);
    router.push(`/cloud?${params.toString()}`);
    setCurrentPath(dirId);
  };

  const navigateToBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    const dirId = breadcrumb.id;
    const params = new URLSearchParams();
    if (dirId) params.set('dir', dirId);
    router.push(`/cloud?${params.toString()}`);
    setCurrentPath(dirId);
  };

  return (
    <div className='flex grow flex-col p-6 max-w-7xl mx-auto'>
      {/* Drag overlay */}
      {isDragging && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8'>
          <div className='bg-white dark:bg-neutral-800 rounded-xl p-10 text-center max-w-lg w-full border-2 border-dashed border-blue-400'>
            <div className='flex justify-center mb-6'>
              <FiUpload size={48} className='text-blue-500' />
            </div>
            <h3 className='text-2xl font-bold mb-2 dark:text-white'>Drop files to upload</h3>
            <p className='text-neutral-600 dark:text-neutral-400'>
              Files will be uploaded to{' '}
              {explorerData.current_directory ? `"${explorerData.current_directory.name}"` : 'your root folder'}
            </p>
          </div>
        </div>
      )}

      <div className='mb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-semibold text-neutral-800 dark:text-white mb-1'>
            {explorerData.current_directory ? explorerData.current_directory.name : 'My Cloud'}
          </h1>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {explorerData.files.length} file{explorerData.files.length !== 1 ? 's' : ''} • {explorerData.directories.length} folder
            {explorerData.directories.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Link href='/cloud/upload'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-2 border-white border-2 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium'
            >
              <FiUpload size={18} />
              <span>Upload</span>
            </motion.button>
          </Link>
        </div>
      </div>

      <div className='flex items-center mb-6 shadow-sm backdrop-blur-sm rounded-xl px-4 py-2.5 overflow-hidden border border-neutral-100 dark:border-neutral-700'>
        <div className='flex items-center space-x-1 overflow-x-auto scrollbar-hide w-full'>
          <div className='flex items-center'>
            <button
              onClick={() => navigateToDirectory('')}
              className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-all duration-200`}
            >
              <FiHome className='flex-shrink-0' size={15} />
              <span className='text-sm whitespace-nowrap'>Home</span>
            </button>
          </div>

          {explorerData.breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className='flex items-center flex-shrink-0'>
              <span className='mx-1.5 text-neutral-400 dark:text-neutral-500'>
                <FiChevronRight className='flex-shrink-0' size={14} />
              </span>
              <button
                onClick={() => navigateToBreadcrumb(breadcrumb)}
                className={`py-1.5 px-3 rounded-lg text-sm transition-all duration-200 flex items-center`}
              >
                <span className='truncate max-w-[150px]' title={breadcrumb.name}>
                  {breadcrumb.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className='animate-pulse'>
              <div className='bg-neutral-200 dark:bg-neutral-700 aspect-square rounded-xl mb-3'></div>
              <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      ) : explorerData.directories.length === 0 && explorerData.files.length === 0 ? (
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
      ) : (
        <div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {/* Display directories first */}
            {explorerData.directories.map((directory) => (
              <div
                key={directory.id}
                className='group relative bg-white dark:bg-neutral-800 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
                onClick={() => navigateToDirectory(directory.id)}
              >
                <div className='cursor-pointer'>
                  <div className='aspect-video bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center overflow-hidden'>
                    <div className='flex justify-center items-center w-full h-full text-blue-500 dark:text-blue-400'>
                      <FiFolder size={52} />
                    </div>
                  </div>
                  <div className='p-3'>
                    <p className='font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis text-neutral-800 dark:text-neutral-300 mb-1'>
                      {directory.name}
                    </p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-500'>Folder</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Then display files */}
            {explorerData.files.map((file) => (
              <div
                key={file.id}
                className='group relative bg-white dark:bg-neutral-800 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
              >
                <div className='cursor-pointer'>
                  <div className='aspect-video bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center overflow-hidden'>
                    {renderThumbnail(file)}
                  </div>
                  <div className='p-3'>
                    <div className='flex items-center mb-1'>
                      <p className='font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis text-neutral-800 dark:text-neutral-300 flex-grow'>
                        {file.name}
                      </p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-xs text-neutral-500 dark:text-neutral-500'>{formatFileSize(file.size)}</p>
                      <p className='text-xs text-neutral-500 dark:text-neutral-500'>
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudExplorer;
