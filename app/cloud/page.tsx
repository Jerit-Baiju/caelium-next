'use client';

import { BreadcrumbItem, ExplorerData, FileData } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArchive, FiChevronRight, FiCode, FiFile, FiFileText, FiFolder, FiHome, FiImage, FiMusic, FiUpload, FiVideo } from 'react-icons/fi';

const CloudExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useAxios();
  const [loading, setLoading] = useState(true);
  const [explorerData, setExplorerData] = useState<ExplorerData>({
    directories: [],
    files: [],
    breadcrumbs: [],
    current_directory: null,
  });
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectedDirectories, setSelectedDirectories] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState<string>(searchParams?.get('dir') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/cloud/explorer${currentPath ? `?parent=${currentPath}` : ''}`);
        setExplorerData(response.data);
      } catch (error) {
        console.error('Error fetching explorer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPath]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const imageFiles = explorerData.files.filter((file) => file.mime_type.startsWith('image/'));

      if (imageFiles.length === 0) return {};

      const batchSize = 8;
      const urls: Record<string, string> = {};

      for (let i = 0; i < imageFiles.length; i += batchSize) {
        const batch = imageFiles.slice(i, i + batchSize);

        try {
          const results = await Promise.all(
            batch.map(async (file) => {
              try {
                const response = await api.get(file.download_url, { responseType: 'blob' });
                const objectUrl = URL.createObjectURL(response.data);
                return { id: file.id, url: objectUrl };
              } catch (error) {
                console.error(`Error fetching image ${file.name}:`, error);
                return { id: file.id, url: null };
              }
            }),
          );

          results.forEach(({ id, url }) => {
            if (url) urls[id] = url;
          });
        } catch (error) {
          console.error('Error fetching batch of images:', error);
        }
      }

      setImageUrls(urls);

      return () => {
        Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
      };
    };

    if (explorerData.files.length > 0) {
      fetchImageUrls();
    }

    return () => {
      setImageUrls({});
    };
  }, [explorerData.files]);

  const renderThumbnail = (file: FileData) => {
    if (file.mime_type.startsWith('image/')) {
      return imageUrls[file.id] ? (
        <img src={imageUrls[file.id]} alt={file.name} className='w-full h-full object-cover rounded-md' />
      ) : (
        <div className='flex justify-center items-center h-full w-full text-neutral-400 dark:text-neutral-500'>
          <FiImage size={24} />
        </div>
      );
    } else if (file.mime_type.startsWith('video/')) {
      return (
        <div className='flex justify-center items-center h-full w-full text-blue-400 dark:text-blue-300'>
          <FiVideo size={24} />
        </div>
      );
    } else if (file.mime_type.startsWith('audio/')) {
      return (
        <div className='flex justify-center items-center h-full w-full text-purple-400 dark:text-purple-300'>
          <FiMusic size={24} />
        </div>
      );
    } else if (file.mime_type.includes('pdf')) {
      return (
        <div className='flex justify-center items-center h-full w-full text-red-400 dark:text-red-300'>
          <FiFileText size={24} />
        </div>
      );
    } else if (file.mime_type.includes('zip') || file.mime_type.includes('archive')) {
      return (
        <div className='flex justify-center items-center h-full w-full text-amber-400 dark:text-amber-300'>
          <FiArchive size={24} />
        </div>
      );
    } else if (file.mime_type.includes('code') || file.name.match(/\.(js|ts|html|css|py|java|cpp|php|json)$/)) {
      return (
        <div className='flex justify-center items-center h-full w-full text-emerald-400 dark:text-emerald-300'>
          <FiCode size={24} />
        </div>
      );
    }
    return (
      <div className='flex justify-center items-center h-full w-full text-neutral-400 dark:text-neutral-500'>
        <FiFile size={24} />
      </div>
    );
  };

  const toggleFileSelection = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
      setSelectedDirectories(new Set());
    }
    setSelectedFiles(newSelection);
  };

  const toggleDirectorySelection = (dirId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedDirectories);
    if (newSelection.has(dirId)) {
      newSelection.delete(dirId);
    } else {
      newSelection.add(dirId);
      setSelectedFiles(new Set());
    }
    setSelectedDirectories(newSelection);
  };

  const navigateToDirectory = (dirId: string) => {
    const params = new URLSearchParams();
    if (dirId) params.set('dir', dirId);
    router.push(`/cloud?${params.toString()}`);
    setCurrentPath(dirId);
    setSelectedFiles(new Set());
    setSelectedDirectories(new Set());
  };

  const navigateToBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    const dirId = breadcrumb.id;
    const params = new URLSearchParams();
    if (dirId) params.set('dir', dirId);
    router.push(`/cloud?${params.toString()}`);
    setCurrentPath(dirId);
    setSelectedFiles(new Set());
    setSelectedDirectories(new Set());
  };

  return (
    <div className='flex grow flex-col p-6 max-w-7xl mx-auto'>
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
        
        <Link href="/cloud/upload">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 bg-gradient-to-br from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium'
          >
            <FiUpload size={18} />
            <span>Upload</span>
          </motion.button>
        </Link>
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
          <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xs'>
            Upload some files or create a new folder to get started
          </p>
        </div>
      ) : (
        <div>
          {explorerData.directories.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4 ml-1'>
                Folders
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                {explorerData.directories.map((directory) => (
                  <div
                    key={directory.id}
                    className={`group relative bg-white dark:bg-neutral-800 rounded-xl transition-all duration-200 overflow-hidden ${
                      selectedDirectories.has(directory.id) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'hover:shadow-md shadow-sm'
                    }`}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        toggleDirectorySelection(directory.id, e);
                      } else {
                        navigateToDirectory(directory.id);
                      }
                    }}
                  >
                    <div className='aspect-square flex flex-col items-center justify-center p-4 cursor-pointer'>
                      <div className='flex justify-center items-center h-24 mb-3 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors'>
                        <FiFolder size={50} />
                      </div>
                      <div className='w-full'>
                        <p className='font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis text-neutral-800 dark:text-neutral-200 text-center'>
                          {directory.name}
                        </p> 
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {explorerData.files.length > 0 && (
            <div>
              <h2 className='text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4 ml-1'>Files</h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                {explorerData.files.map((file) => (
                  <div
                    key={file.id}
                    className={`group relative bg-white dark:bg-neutral-800 rounded-xl transition-all duration-200 overflow-hidden ${
                      selectedFiles.has(file.id) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'hover:shadow-md shadow-sm'
                    }`}
                    onClick={(e) => toggleFileSelection(file.id, e)}
                  >
                    <div className='aspect-square flex items-center justify-center bg-neutral-50 dark:bg-neutral-700/50'>{renderThumbnail(file)}</div>
                    <div className='p-3'>
                      <p className='font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis text-neutral-800 dark:text-neutral-200'>
                        {file.name}
                      </p>
                      <div className='flex justify-between items-center mt-1'>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>{formatFileSize(file.size)}</p>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default CloudExplorer;
