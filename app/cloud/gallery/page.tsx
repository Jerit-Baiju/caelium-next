'use client';
import FilePreview from '@/components/cloud/preview';
import { MediaItem } from '@/helpers/props';
import useCloud from '@/hooks/useCloud';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiArrowLeft, FiFilm, FiImage, FiShare2, FiUpload } from 'react-icons/fi';

const CloudGalleryPage = () => {
  // Use the useCloud hook with the gallery-specific configuration
  const {
    loading,
    files: mediaFiles,
    thumbnailUrls,
    selectedFile,
    isPreviewOpen,
    selectedFileIndex,
    isDragging,
    isUploading,
    uploadProgress,

    fetchMediaFiles,
    downloadFile,
    uploadFiles,
    openFilePreview,
    closeFilePreview,
    nextFilePreview,
    previousFilePreview,

    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  } = useCloud({
    autoFetch: false, // Don't fetch directory contents automatically
  });

  // Custom drop handler for gallery that ensures autoOrganize is true
  const handleGalleryDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset drag state immediately to fix UI not returning to normal
    handleDragLeave(e);

    // Process dropped files
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);

      try {
        // Upload with autoOrganize set to true for gallery
        await uploadFiles(droppedFiles, {
          autoOrganize: true,
          onProgress: (progress) => {
            console.log(`Upload progress: ${progress}%`);
          },
        });

        // Add a small delay before fetching to allow server-side processing to complete
        setTimeout(() => {
          // Completely refresh media files and thumbnails after upload
          fetchMediaFiles();
        }, 500);
      } catch (error) {
        console.error('Error uploading files:', error);
        // Ensure UI state is reset even on error
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Fetch media files on component mount
  useEffect(() => {
    fetchMediaFiles();

    // Add a refresh interval to ensure thumbnails load properly
    const refreshInterval = setInterval(() => {
      if (mediaFiles.length > 0 && Object.keys(thumbnailUrls).length < mediaFiles.length) {
        console.log('Refreshing thumbnails...');
        fetchMediaFiles();
      }
    }, 3000);

    return () => clearInterval(refreshInterval);
  }, [mediaFiles.length, Object.keys(thumbnailUrls).length]);

  // Check if a file is a video
  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  // Handle file download wrapper
  const handleFileDownload = (downloadUrl: string, fileName: string) => {
    downloadFile(downloadUrl, fileName);
  };

  // Handle file preview wrapper
  const handleFilePreview = (index: number) => {
    openFilePreview(mediaFiles[index], index);
  };

  return (
    <div
      className='flex grow flex-col'
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleGalleryDrop}
    >
      {/* Main content container - removed blue background styling when dragging */}
      <div className='flex flex-col grow py-6 mx-auto space-y-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div className='flex justify-between items-center' variants={itemVariants}>
          <div className='flex items-center gap-4'>
            <Link href='/cloud' className='text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'>
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className='text-3xl font-bold dark:text-neutral-100'>Gallery</h1>
              <p className='text-neutral-600 dark:text-neutral-400'>Browse your images and videos</p>
            </div>
          </div>
          <Link href='/cloud/upload'>
            <button className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'>
              <FiUpload className='mr-2' />
              <span>Upload Media</span>
            </button>
          </Link>
        </motion.div>

        {/* Media Grid */}
        <motion.div variants={itemVariants} className='rounded-xl p-6 shadow-sm'>
          {loading ? (
            <div className='text-center py-10'>
              <p className='text-neutral-500 dark:text-neutral-400'>Loading your gallery...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div
              className={`text-center py-16 ${isDragging ? 'border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl' : ''}`}
            >
              <div className='flex justify-center mb-4'>
                <FiImage size={48} className='text-neutral-400' />
              </div>
              <p className='text-neutral-500 dark:text-neutral-400 mb-2'>
                {isDragging ? 'Drop media files here to upload' : 'No images or videos found in your cloud storage.'}
              </p>
              {isDragging ? (
                <p className='text-neutral-500 dark:text-neutral-400'>Files will be automatically organized in your gallery</p>
              ) : (
                <Link href='/cloud/upload'>
                  <button className='mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition'>
                    Upload Media
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {mediaFiles.map((item, index) => (
                  <div
                    key={item.id}
                    className='relative group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition'
                    onClick={() => handleFilePreview(index)}
                  >
                    {/* Fixed aspect ratio container to prevent layout shifts */}
                    <div className='aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden relative'>
                      {/* Skeleton/placeholder that stays visible until image loads */}
                      <div className='absolute inset-0 bg-neutral-200 dark:bg-neutral-600 animate-pulse z-0'></div>

                      {thumbnailUrls[item.id] ? (
                        <>
                          {isVideo(item.mime_type) ? (
                            <>
                              {/* Video thumbnail with play overlay */}
                              <img
                                src={thumbnailUrls[item.id]}
                                alt={item.name}
                                className='w-full h-full object-cover transition-opacity duration-300 relative z-10'
                                style={{ opacity: 0 }} // Start with 0 opacity
                                onLoad={(e) => {
                                  // Fade in the image once loaded
                                  (e.target as HTMLImageElement).style.opacity = '1';
                                  // Hide the loading overlay
                                  if (e.currentTarget.previousElementSibling) {
                                    (e.currentTarget.previousElementSibling as HTMLElement).classList.remove('animate-pulse');
                                    (e.currentTarget.previousElementSibling as HTMLElement).style.opacity = '0';
                                  }
                                }}
                                onError={(e) => {
                                  // Hide the image on error and show the icon
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              {/* Play button overlay for videos */}
                              <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'>
                                <div className='bg-black/40 rounded-full p-3'>
                                  <FiFilm className='text-white' size={24} />
                                </div>
                              </div>
                            </>
                          ) : (
                            // Regular image
                            <img
                              src={thumbnailUrls[item.id]}
                              alt={item.name}
                              className='w-full h-full object-cover transition-opacity duration-300 relative z-10'
                              style={{ opacity: 0 }} // Start with 0 opacity
                              onLoad={(e) => {
                                // Fade in the image once loaded
                                (e.target as HTMLImageElement).style.opacity = '1';
                                // Hide the loading overlay
                                if (e.currentTarget.previousElementSibling) {
                                  (e.currentTarget.previousElementSibling as HTMLElement).classList.remove('animate-pulse');
                                  (e.currentTarget.previousElementSibling as HTMLElement).style.opacity = '0';
                                }
                              }}
                              onError={(e) => {
                                // Hide the image on error and show the icon
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                        </>
                      ) : (
                        // Fallback icon
                        <div className='relative z-10'>
                          {isVideo(item.mime_type) ? (
                            <FiFilm size={32} className='text-neutral-400' />
                          ) : (
                            <FiImage size={32} className='text-neutral-400' />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Overlay with actions */}
                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
                      <button
                        className='p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileDownload(item.download_url, item.name);
                        }}
                      >
                        <FiShare2 size={18} />
                      </button>
                    </div>

                    {/* Caption with file type indicator */}
                    <div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1 truncate'>
                      <div className='flex items-center gap-1'>
                        {isVideo(item.mime_type) ? <FiFilm size={10} /> : <FiImage size={10} />}
                        <span>{item.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Drag overlay - simplified with less dramatic coloring */}
      {isDragging && (
        <div className='fixed inset-0 bg-black/5 dark:bg-black/20 pointer-events-none z-10 flex items-center justify-center'>
          <div className='bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg'>
            <p className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>Drop media files to add to your gallery</p>
          </div>
        </div>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <div className='fixed bottom-5 right-5 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-w-md'>
          <h3 className='font-medium text-neutral-800 dark:text-neutral-200 mb-2'>Uploading media...</h3>
          <div className='w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-1'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{
                width: `${(Object.values(uploadProgress).reduce((a, b) => a + b, 0) / (Object.keys(uploadProgress).length * 100)) * 100}%`,
              }}
            />
          </div>
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>{Object.keys(uploadProgress).length} file(s) uploading</p>
        </div>
      )}

      {/* Media Preview Dialog using the FilePreview component */}
      <FilePreview
        isOpen={isPreviewOpen}
        onClose={closeFilePreview}
        file={selectedFile as MediaItem | null}
        onDownload={handleFileDownload}
        onNext={nextFilePreview}
        onPrevious={previousFilePreview}
        hasNext={selectedFileIndex < mediaFiles.length - 1}
        hasPrevious={selectedFileIndex > 0}
      />
    </div>
  );
};

export default CloudGalleryPage;
