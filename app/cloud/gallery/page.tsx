'use client';
import FilePreview from '@/components/cloud/preview';
import { MediaItem } from '@/helpers/props';
import { formatTimeSince } from '@/helpers/utils';
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
    
    fetchMediaFiles,
    downloadFile,
    openFilePreview,
    closeFilePreview,
    nextFilePreview,
    previousFilePreview,
  } = useCloud({
    autoFetch: false, // Don't fetch directory contents automatically
  });

  // Simplified motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Fetch media files on component mount
  useEffect(() => {
    fetchMediaFiles();
  }, []);

  // Check if a file is a video
  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  // Convert mediaFiles to MediaItem objects for the FilePreview component
  const mediaItems: MediaItem[] = mediaFiles.map((file) => ({
    id: file.id,
    name: file.name,
    size: formatFileSize(file.size),
    time: formatTimeSince(file.created_at),
    color: file.mime_type.startsWith('image/') ? 'emerald' : 'purple',
    download_url: file.download_url,
    preview_url: file.preview_url,
    mime_type: file.mime_type,
    path: file.path,
    category: file.category,
    owner_details: file.owner_details,
  }));

  // Handle file download wrapper
  const handleFileDownload = (downloadUrl: string, fileName: string) => {
    downloadFile(downloadUrl, fileName);
  };

  // Handle file preview wrapper
  const handleFilePreview = (index: number) => {
    openFilePreview(mediaFiles[index], index);
  };

  return (
    <div className='flex grow flex-col'>
      {/* Main content container */}
      <div className='flex flex-col grow py-6 mx-auto space-y-8 w-full max-w-7xl'>
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
            <div className='text-center py-10'>
              <div className='flex justify-center mb-4'>
                <FiImage size={48} className='text-neutral-400' />
              </div>
              <p className='text-neutral-500 dark:text-neutral-400'>No images or videos found in your cloud storage.</p>
              <Link href='/cloud/upload'>
                <button className='mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition'>
                  Upload Media
                </button>
              </Link>
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
