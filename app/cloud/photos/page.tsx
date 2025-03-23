'use client';
import FilePreview from '@/components/cloud/preview';
import { formatTimeSince } from '@/helpers/utils';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiImage, FiShare2, FiUpload } from 'react-icons/fi';

interface FileData {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  modified_at: string;
  download_url: string;
  preview_url: string | null;
}

interface PhotoItem {
  id: string;
  name: string;
  size: string;
  time: string;
  color: string;
  download_url: string;
  preview_url: string | null;
  mime_type: string;
}

const CloudPhotosPage = () => {
  const [photos, setPhotos] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<PhotoItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const api = useAxios();
  const { toast } = useToast();

  // Simplified motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Fetch photos on component mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/cloud/files/');
        // Filter only image files
        const imageFiles = response.data.filter((file: FileData) => 
          file.mime_type.startsWith('image/')
        );
        setPhotos(imageFiles);
      } catch (error) {
        console.error('Error fetching photos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your photos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
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
          'Authorization': `Bearer ${accessToken}`
        }
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
  const handleFilePreview = (file: PhotoItem) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  // Function to close preview
  const handleClosePreview = () => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
  };

  // Convert FileData to PhotoItem objects
  const photoItems: PhotoItem[] = photos.map(photo => ({
    id: photo.id,
    name: photo.name,
    size: formatFileSize(photo.size),
    time: formatTimeSince(photo.created_at),
    color: 'emerald', // All photos have the same color classification
    download_url: photo.download_url,
    preview_url: photo.preview_url,
    mime_type: photo.mime_type
  }));

  // Load thumbnails for photos
  useEffect(() => {
    const loadThumbnails = async () => {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return;
      
      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;
      
      const newThumbnailUrls: Record<string, string> = {};
      
      for (const photo of photos) {
        if (photo.preview_url || photo.download_url) {
          try {
            const url = photo.preview_url || photo.download_url;
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            
            if (response.ok) {
              const blob = await response.blob();
              const blobUrl = window.URL.createObjectURL(blob);
              newThumbnailUrls[photo.id] = blobUrl;
            }
          } catch (error) {
            console.error(`Error loading thumbnail for ${photo.name}:`, error);
          }
        }
      }
      
      setThumbnailUrls(newThumbnailUrls);
    };
    
    if (photos.length > 0) {
      loadThumbnails();
    }
    
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailUrls).forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [photos]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all thumbnail URLs
      Object.values(thumbnailUrls).forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [thumbnailUrls]);

  return (
    <motion.div
      className='flex flex-col gap-6 p-6 lg:p-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='p-6 mx-auto space-y-8 w-full max-w-7xl'>
        {/* Header */}
        <motion.div className='flex justify-between items-center' variants={itemVariants}>
          <div className="flex items-center gap-4">
            <Link href="/cloud" className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className='text-3xl font-bold dark:text-neutral-100'>Photos</h1>
              <p className='text-neutral-600 dark:text-neutral-400'>Browse your images</p>
            </div>
          </div>
          <Link href="/cloud/upload">
            <button className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'>
              <FiUpload className='mr-2' />
              <span>Upload Photos</span>
            </button>
          </Link>
        </motion.div>

        {/* Photo Grid */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          {loading ? (
            <div className='text-center py-10'>
              <p className='text-neutral-500 dark:text-neutral-400'>Loading your photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className='text-center py-10'>
              <div className="flex justify-center mb-4">
                <FiImage size={48} className="text-neutral-400" />
              </div>
              <p className='text-neutral-500 dark:text-neutral-400'>No photos found in your cloud storage.</p>
              <Link href="/cloud/upload">
                <button className='mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition'>
                  Upload Photos
                </button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 dark:text-neutral-200">
                Your Photos ({photos.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photoItems.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    onClick={() => handleFilePreview(photo)}
                  >
                    {/* Fixed aspect ratio container to prevent layout shifts */}
                    <div className="aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden relative">
                      {/* Skeleton/placeholder that stays visible until image loads */}
                      <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-600 animate-pulse z-0"></div>
                      
                      {thumbnailUrls[photo.id] ? (
                        <img 
                          src={thumbnailUrls[photo.id]}
                          alt={photo.name}
                          className="w-full h-full object-cover transition-opacity duration-300 relative z-10"
                          style={{ opacity: 0 }} // Start with 0 opacity
                          onLoad={(e) => {
                            // Smoothly fade in the image once loaded
                            (e.target as HTMLImageElement).style.opacity = '1';
                            // Find and hide the animation on skeleton
                            if (e.currentTarget.previousElementSibling) {
                              (e.currentTarget.previousElementSibling as HTMLElement).classList.remove('animate-pulse');
                              (e.currentTarget.previousElementSibling as HTMLElement).style.opacity = '0';
                            }
                          }}
                          onError={(e) => {
                            // Hide the image on error and show the icon
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Add a fallback icon if needed
                            const iconElement = document.createElement('div');
                            iconElement.className = "absolute inset-0 flex items-center justify-center z-20";
                            iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="text-neutral-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                            e.currentTarget.parentElement?.appendChild(iconElement);
                          }}
                        />
                      ) : (
                        <FiImage size={32} className="text-neutral-400 relative z-10" />
                      )}
                    </div>
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileDownload(photo.download_url, photo.name);
                        }}
                      >
                        <FiShare2 size={18} />
                      </button>
                    </div>
                    
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1 truncate">
                      {photo.name}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Image Preview Dialog using the new component */}
      <FilePreview 
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        file={selectedFile}
        onDownload={handleFileDownload}
      />
    </motion.div>
  );
};

export default CloudPhotosPage;
