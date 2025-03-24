'use client';
import FilePreview from '@/components/cloud/preview';
import { FileData, MediaItem } from '@/helpers/props';
import { formatTimeSince } from '@/helpers/utils';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiFilm, FiImage, FiShare2, FiUpload } from 'react-icons/fi';

const CloudGalleryPage = () => {
  const [mediaFiles, setMediaFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const api = useAxios();
  const { toast } = useToast();
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);

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
    const fetchMediaFiles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/cloud/gallery/');
        // Filter for both image and video files
        const filteredFiles = response.data.filter(
          (file: FileData) => file.mime_type.startsWith('image/') || file.mime_type.startsWith('video/'),
        );
        setMediaFiles(filteredFiles);
      } catch (error) {
        console.error('Error fetching media files:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your gallery files',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, []);

  // Function to handle file download
  const handleFileDownload = async (downloadUrl: string, fileName: string) => {
    try {
      // Get auth token from localStorage
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        toast({
          title: 'Authentication Error',
          description: 'You need to be logged in to download files',
          variant: 'destructive',
        });
        return;
      }

      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;

      // Use fetch API for direct file download
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      // Get the file as a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the file',
        variant: 'destructive',
      });
    }
  };

  // Function to handle file preview
  const handleFilePreview = (file: MediaItem) => {
    setSelectedFile(file);
    // Find the index of the selected file
    const index = mediaItems.findIndex((item) => item.id === file.id);
    setSelectedFileIndex(index);
    setIsPreviewOpen(true);
  };

  // Function to close preview
  const handleClosePreview = () => {
    setSelectedFile(null);
    setSelectedFileIndex(-1);
    setIsPreviewOpen(false);
  };

  // Function to navigate to next file
  const handleNextFile = () => {
    if (selectedFileIndex < mediaItems.length - 1) {
      const nextIndex = selectedFileIndex + 1;
      setSelectedFileIndex(nextIndex);
      setSelectedFile(mediaItems[nextIndex]);
    }
  };

  // Function to navigate to previous file
  const handlePreviousFile = () => {
    if (selectedFileIndex > 0) {
      const prevIndex = selectedFileIndex - 1;
      setSelectedFileIndex(prevIndex);
      setSelectedFile(mediaItems[prevIndex]);
    }
  };

  // Function to determine the file color based on mime type
  const getFileColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return 'emerald';
    } else if (mimeType.startsWith('video/')) {
      return 'purple';
    }
    return 'neutral';
  };

  // Check if a file is a media type (image or video)
  const isMediaFile = (mimeType: string) => {
    return mimeType.startsWith('image/') || mimeType.startsWith('video/');
  };

  // Check if a file is a video
  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  // Convert FileData to MediaItem objects
  const mediaItems: MediaItem[] = mediaFiles.map((file) => ({
    id: file.id,
    name: file.name,
    size: formatFileSize(file.size),
    time: formatTimeSince(file.created_at),
    color: getFileColor(file.mime_type),
    download_url: file.download_url,
    preview_url: file.preview_url,
    mime_type: file.mime_type,
    path: file.path,
    category: file.category,
    owner_details: file.owner_details,
  }));

  // Load thumbnails for media files
  useEffect(() => {
    const loadThumbnails = async () => {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return;

      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;

      const newThumbnailUrls: Record<string, string> = {};

      for (const file of mediaFiles) {
        if (isMediaFile(file.mime_type) && (file.preview_url || file.download_url)) {
          try {
            const url = file.preview_url || file.download_url;
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const blob = await response.blob();
              const blobUrl = window.URL.createObjectURL(blob);
              newThumbnailUrls[file.id] = blobUrl;
            }
          } catch (error) {
            console.error(`Error loading thumbnail for ${file.name}:`, error);
          }
        }
      }

      setThumbnailUrls(newThumbnailUrls);
    };

    if (mediaFiles.length > 0) {
      loadThumbnails();
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailUrls).forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [mediaFiles]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all thumbnail URLs
      Object.values(thumbnailUrls).forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [thumbnailUrls]);

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
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className='relative group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition'
                    onClick={() => handleFilePreview(item)}
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

      {/* Media Preview Dialog using the new component */}
      <FilePreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        file={selectedFile}
        onDownload={handleFileDownload}
        onNext={handleNextFile}
        onPrevious={handlePreviousFile}
        hasNext={selectedFileIndex < mediaItems.length - 1}
        hasPrevious={selectedFileIndex > 0}
      />
    </div>
  );
};

export default CloudGalleryPage;
