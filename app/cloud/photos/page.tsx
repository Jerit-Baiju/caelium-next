'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatTimeSince } from '@/helpers/utils';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiDownload, FiImage, FiShare2, FiUpload } from 'react-icons/fi';

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
  const [previewFile, setPreviewFile] = useState<PhotoItem | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  const handleFilePreview = async (file: PhotoItem) => {
    setPreviewFile(file);
    setPreviewLoading(true);
    setPreviewUrl(null);
    
    try {
      // Get auth token from localStorage
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        toast({
          title: 'Authentication Error',
          description: 'You need to be logged in to preview files',
          variant: 'destructive',
        });
        return;
      }
      
      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;
      
      // Use fetch API to get the image with proper authorization
      const response = await fetch(file.preview_url || file.download_url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.status} ${response.statusText}`);
      }
      
      // Get the file as a blob and create a URL
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: 'Preview Failed',
        description: 'There was an error loading the preview',
        variant: 'destructive',
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Function to clean up blob URLs when dialog closes
  const handleClosePreview = () => {
    if (previewUrl) {
      // Revoke the blob URL to prevent memory leaks
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPreviewFile(null);
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
      // Clean up preview URL
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
      
      // Clean up all thumbnail URLs
      Object.values(thumbnailUrls).forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [previewUrl, thumbnailUrls]);

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
                    <div className="aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                      {thumbnailUrls[photo.id] ? (
                        <img 
                          src={thumbnailUrls[photo.id]}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide the image on error and show the icon
                            (e.target as HTMLImageElement).style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('fallback-icon');
                          }}
                        />
                      ) : (
                        <FiImage size={32} className="text-neutral-400" />
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
                        <FiDownload size={18} />
                      </button>
                      <button 
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition"
                        onClick={(e) => e.stopPropagation()}
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

      {/* Image Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && handleClosePreview()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="relative w-full h-auto min-h-[300px] max-h-[70vh] overflow-hidden rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
              {previewLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-neutral-500">Loading preview...</p>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt={previewFile?.name || 'Preview'}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FiImage size={48} className="text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-500">Preview not available</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              {previewFile?.size} • uploaded {previewFile?.time}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button 
                onClick={() => {
                  if (previewFile) {
                    handleFileDownload(previewFile.download_url, previewFile.name);
                  }
                }}
                className="flex items-center space-x-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 px-4 py-2 rounded-md"
              >
                <FiDownload />
                <span>Download</span>
              </button>
              <button
                className="flex items-center space-x-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 px-4 py-2 rounded-md"
              >
                <FiShare2 />
                <span>Share</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CloudPhotosPage;
