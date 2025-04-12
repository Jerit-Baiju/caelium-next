'use client';

import FilePreview from '@/components/cloud/preview';
import { BreadcrumbItem, ExplorerData, FileData } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import useCloud from '@/hooks/useCloud';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiArchive,
  FiCheck,
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
  FiX,
} from 'react-icons/fi';

const CloudExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatFileSize, fetchExplorerData, fetchImageUrls, getFileThumbnailType } = useCloud();
  const api = useAxios();
  const [loading, setLoading] = useState(true);
  const [explorerData, setExplorerData] = useState<ExplorerData>({
    directories: [],
    files: [],
    breadcrumbs: [],
    current_directory: null,
  });

  // File preview states
  const [previewFile, setPreviewFile] = useState<{
    id: string;
    name: string;
    size: string;
    time: string;
    download_url: string;
    mime_type: string;
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);

  // Use useRef to persist the image cache between directory navigations
  const imageUrlsCacheRef = useRef<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [currentPath, setCurrentPath] = useState<string>(searchParams?.get('dir') || '');

  // Drag and drop upload states
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({});

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
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        setDroppedFiles(files);
      }
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

  // Function to handle file upload - updated with proper parent_directory parameter
  const handleUpload = async () => {
    if (droppedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Add all selected files to FormData
      droppedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Set auto_organize to false
      formData.append('auto_organize', 'false');

      // Add parent_directory parameter if we have a currentPath
      if (currentPath) {
        formData.append('parent_directory', currentPath);
      }

      // Set progress tracking for each file
      const newProgress: Record<string, number> = {};
      droppedFiles.forEach((file) => {
        newProgress[file.name] = 0;
      });
      setUploadProgressMap(newProgress);

      // Configure upload with progress tracking
      const response = await api.post('/api/cloud/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const updatedProgress: Record<string, number> = {};
            droppedFiles.forEach((file) => {
              updatedProgress[file.name] = percentCompleted;
            });
            setUploadProgressMap(updatedProgress);
            setUploadProgress(percentCompleted);
          }
        },
      });

      const completedProgress: Record<string, number> = {};
      droppedFiles.forEach((file) => {
        completedProgress[file.name] = 100;
      });
      setUploadProgressMap(completedProgress);

      const data = await fetchExplorerData(currentPath);
      setExplorerData(data);

      setTimeout(() => {
        setDroppedFiles([]);
      }, 1500);
    } catch (error) {
      console.error('Error uploading files:', error);

      const failedProgress: Record<string, number> = {};
      droppedFiles.forEach((file) => {
        failedProgress[file.name] = -1;
      });
      setUploadProgressMap(failedProgress);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setDroppedFiles([]);
  };

  useEffect(() => {
    const cachedUrls: Record<string, string> = {};
    const filesToFetch: FileData[] = [];

    explorerData.files
      .filter((file) => getFileThumbnailType(file) === 'image')
      .forEach((file) => {
        if (imageUrlsCacheRef.current[file.id]) {
          cachedUrls[file.id] = imageUrlsCacheRef.current[file.id];
        } else {
          filesToFetch.push(file);
        }
      });

    if (Object.keys(cachedUrls).length > 0) {
      setImageUrls(cachedUrls);
    }

    const loadImageThumbnails = async () => {
      if (filesToFetch.length === 0) return;

      for (let i = 0; i < filesToFetch.length; i += 5) {
        const batch = filesToFetch.slice(i, i + 5);
        try {
          const urls = await fetchImageUrls(batch);
          if (urls) {
            Object.entries(urls).forEach(([fileId, url]) => {
              setImageUrls((prevUrls) => ({
                ...prevUrls,
                [fileId]: url,
              }));

              imageUrlsCacheRef.current = {
                ...imageUrlsCacheRef.current,
                [fileId]: url,
              };
            });
          }
        } catch (error) {
          console.error(`Error loading thumbnails for batch ${i / 5 + 1}:`, error);
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

  // Handle opening the file preview
  const openFilePreview = (file: FileData, index: number) => {
    // For image files, check if we already have a cached version
    const isImage = file.mime_type.startsWith('image/');
    let cachedUrl = null;
    
    if (isImage) {
      // Try to get the cached URL from our image cache
      cachedUrl = imageUrls[file.id] || imageUrlsCacheRef.current[file.id];
    }
    
    setPreviewFile({
      id: file.id,
      name: file.name,
      size: formatFileSize(file.size),
      time: new Date(file.created_at).toLocaleDateString(),
      download_url: cachedUrl || file.download_url, // Use cached URL if available
      mime_type: file.mime_type,
    });
    setCurrentFileIndex(index);
    setPreviewOpen(true);
  };

  // Handle closing the file preview
  const closeFilePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  // Navigate to the next file in preview
  const goToNextFile = () => {
    if (currentFileIndex < explorerData.files.length - 1) {
      const nextIndex = currentFileIndex + 1;
      const nextFile = explorerData.files[nextIndex];
      
      // For image files, check if we already have a cached version
      const isImage = nextFile.mime_type.startsWith('image/');
      let cachedUrl = null;
      
      if (isImage) {
        // Try to get the cached URL from our image cache
        cachedUrl = imageUrls[nextFile.id] || imageUrlsCacheRef.current[nextFile.id];
      }
      
      setPreviewFile({
        id: nextFile.id,
        name: nextFile.name,
        size: formatFileSize(nextFile.size),
        time: new Date(nextFile.created_at).toLocaleDateString(),
        download_url: cachedUrl || nextFile.download_url, // Use cached URL if available
        mime_type: nextFile.mime_type,
      });
      setCurrentFileIndex(nextIndex);
    }
  };

  // Navigate to the previous file in preview
  const goToPreviousFile = () => {
    if (currentFileIndex > 0) {
      const prevIndex = currentFileIndex - 1;
      const prevFile = explorerData.files[prevIndex];
      
      // For image files, check if we already have a cached version
      const isImage = prevFile.mime_type.startsWith('image/');
      let cachedUrl = null;
      
      if (isImage) {
        // Try to get the cached URL from our image cache
        cachedUrl = imageUrls[prevFile.id] || imageUrlsCacheRef.current[prevFile.id];
      }
      
      setPreviewFile({
        id: prevFile.id,
        name: prevFile.name,
        size: formatFileSize(prevFile.size),
        time: new Date(prevFile.created_at).toLocaleDateString(),
        download_url: cachedUrl || prevFile.download_url, // Use cached URL if available
        mime_type: prevFile.mime_type,
      });
      setCurrentFileIndex(prevIndex);
    }
  };

  // Handle file download
  const handleFileDownload = async (url: string, fileName: string) => {
    try {
      // Get auth token from localStorage
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        console.error('Authentication required');
        return;
      }

      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;

      // Use fetch API to get the file with proper authorization
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Create a blob and download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className='flex grow flex-col p-6 max-w-7xl mx-auto'>
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

      {droppedFiles.length > 0 && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8'>
          <div className='bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full border border-neutral-200 dark:border-neutral-700'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold dark:text-white'>Confirm Upload</h3>
              <button
                onClick={cancelUpload}
                className='p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700'
                disabled={isUploading}
              >
                <FiX size={20} />
              </button>
            </div>

            {isUploading ? (
              <div className='mb-6'>
                <p className='mb-2 text-neutral-600 dark:text-neutral-400'>Uploading files... ({uploadProgress}%)</p>
                <div className='w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5'>
                  <div
                    className='bg-blue-500 h-2.5 rounded-full'
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <p className='mb-4 text-neutral-600 dark:text-neutral-400'>
                  {droppedFiles.length} file{droppedFiles.length !== 1 ? 's' : ''} ready to upload to{' '}
                  {explorerData.current_directory ? `"${explorerData.current_directory.name}"` : 'your root folder'}
                </p>

                <div className='max-h-60 overflow-y-auto mb-6 border border-neutral-200 dark:border-neutral-700 rounded-lg'>
                  <ul className='divide-y divide-neutral-200 dark:divide-neutral-700'>
                    {droppedFiles.map((file, index) => (
                      <li key={index} className='p-3 flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                          <div className='text-neutral-500'>
                            {file.type.startsWith('image/') ? (
                              <FiImage size={20} />
                            ) : file.type.startsWith('video/') ? (
                              <FiVideo size={20} />
                            ) : file.type.startsWith('audio/') ? (
                              <FiMusic size={20} />
                            ) : (
                              <FiFile size={20} />
                            )}
                          </div>
                          <span className='text-sm truncate max-w-xs'>{file.name}</span>
                        </div>
                        <div className='flex items-center'>
                          {uploadProgressMap[file.name] === 100 && (
                            <div className='flex items-center text-green-500 dark:text-green-400 mr-2'>
                              <FiCheck size={16} />
                            </div>
                          )}
                          {uploadProgressMap[file.name] === -1 && (
                            <span className='text-red-500 text-xs mr-2'>Failed</span>
                          )}
                          <span className='text-xs text-neutral-500'>{formatFileSize(file.size)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className='flex justify-end gap-3'>
              <button
                onClick={cancelUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 text-sm
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                {isUploading ? 'Uploading...' : (
                  <>
                    <FiCheck size={16} />
                    Confirm Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mb-6 flex justify-between items-center'>
        {loading ? (
          <div className='animate-pulse'>
            <div className='h-7 bg-neutral-200 dark:bg-neutral-700 rounded w-64 mb-2'></div>
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-40'></div>
          </div>
        ) : (
          <div>
            <h1 className='text-2xl font-semibold text-neutral-800 dark:text-white mb-1'>
              {explorerData.current_directory ? explorerData.current_directory.name : 'My Cloud'}
            </h1>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              {explorerData.files.length} file{explorerData.files.length !== 1 ? 's' : ''} • {explorerData.directories.length} folder
              {explorerData.directories.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

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
        {loading ? (
          <div className='flex items-center space-x-2 w-full py-1'>
            <div className='flex items-center py-1.5 px-3 rounded-lg'>
              <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-14'></div>
            </div>
            <div className='text-neutral-400 dark:text-neutral-500'>
              <FiChevronRight size={14} />
            </div>
            <div className='py-1.5 px-3 rounded-lg'>
              <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24'></div>
            </div>
            <div className='text-neutral-400 dark:text-neutral-500'>
              <FiChevronRight size={14} />
            </div>
            <div className='py-1.5 px-3 rounded-lg'>
              <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32'></div>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4'>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className='animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
              <div className='aspect-square bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center'>
                <div className='bg-neutral-200 dark:bg-neutral-700 h-16 w-16 rounded'></div>
              </div>
              <div className='p-3'>
                <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2'></div>
                <div className='flex justify-between'>
                  <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3'></div>
                  <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4'></div>
                </div>
              </div>
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
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4'>
            {explorerData.directories.map((directory) => (
              <div
                key={directory.id}
                className='group relative bg-white dark:bg-neutral-800 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
                onClick={() => navigateToDirectory(directory.id)}
              >
                <div className='cursor-pointer'>
                  <div className='aspect-square bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center overflow-hidden'>
                    <div className='flex justify-center items-center w-full h-full text-blue-500 dark:text-blue-400'>
                      <FiFolder size={64} />
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

            {explorerData.files.map((file, index) => (
              <div
                key={file.id}
                className='group relative bg-white dark:bg-neutral-800 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
                onClick={() => openFilePreview(file, index)}
              >
                <div className='cursor-pointer'>
                  <div className='aspect-square bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center overflow-hidden'>
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

      {/* File Preview Component */}
      <FilePreview 
        isOpen={previewOpen}
        onClose={closeFilePreview}
        file={previewFile}
        onDownload={handleFileDownload}
        onNext={currentFileIndex < explorerData.files.length - 1 ? goToNextFile : undefined}
        onPrevious={currentFileIndex > 0 ? goToPreviousFile : undefined}
        hasNext={currentFileIndex < explorerData.files.length - 1}
        hasPrevious={currentFileIndex > 0}
      />
    </div>
  );
};

export default CloudExplorer;
