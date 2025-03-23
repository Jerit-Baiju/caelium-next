'use client';
import FilePreview from '@/components/cloud/preview';
import { formatTimeSince } from '@/helpers/utils';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { FiDownload, FiFile, FiGrid, FiHardDrive, FiImage, FiShare2, FiStar, FiUpload } from 'react-icons/fi';

// Utility function to get color classes
const getColorClasses = (color: string, type: 'bg' | 'text') => {
  const colorMap: Record<string, Record<string, string>> = {
    bg: {
      blue: 'bg-blue-100 dark:bg-blue-900/30',
      purple: 'bg-purple-100 dark:bg-purple-900/30',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
      amber: 'bg-amber-100 dark:bg-amber-900/30',
      rose: 'bg-rose-100 dark:bg-rose-900/30',
      violet: 'bg-violet-100 dark:bg-violet-900/30',
      neutral: 'bg-neutral-100 dark:bg-neutral-900/30',
    },
    text: {
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      emerald: 'text-emerald-600 dark:text-emerald-400',
      amber: 'text-amber-600 dark:text-amber-400',
      rose: 'text-rose-600 dark:text-rose-400',
      violet: 'text-violet-600 dark:text-violet-400',
      neutral: 'text-neutral-600 dark:text-neutral-400',
    }
  };
  
  return colorMap[type][color] || '';
};

interface NavigationItem {
  name: string;
  icon: JSX.Element; // Changed from React.ComponentType to JSX.Element
  color: string;
}

interface StorageItem {
  type: string;
  icon: JSX.Element; // Changed from React.ComponentType to JSX.Element
  amount: string;
  color: string;
}

interface FileItem {
  name: string;
  icon: JSX.Element; // Changed from type to icon, and from React.ComponentType to JSX.Element
  size: string;
  time: string;
  color: string;
  id: string; // Change to string to handle UUIDs correctly
  download_url: string;
  preview_url: string | null;
  mime_type: string;
}

interface ActivityItem {
  action: string;
  time: string;
  color: string;
}

// File type definition
interface FileData {
  id: string; // Change to string to handle UUIDs correctly
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  modified_at: string;
  download_url: string;
  preview_url: string | null;
}

const CloudDashboard = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const api = useAxios();
  const { toast } = useToast();

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/cloud/files/');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your files',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
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

  // Function to determine the file type icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FiImage />;
    }
    return <FiFile />;
  };

  // Function to get the file color based on mime type
  const getFileColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return 'emerald';
    } else if (mimeType.includes('pdf')) {
      return 'rose';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'blue';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'amber';
    }
    return 'neutral';
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  // Simplified motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Remove complex hover effects
  const cardHoverVariants = {
    hover: { scale: 1.01, transition: { duration: 0.2 } }
  };

  const navigationItems: NavigationItem[] = [
    { name: 'All Files', icon: <FiGrid />, color: 'blue' },
    { name: 'Photos', icon: <FiImage />, color: 'purple' },
    { name: 'Documents', icon: <FiFile />, color: 'emerald' },
    { name: 'Favorites', icon: <FiStar />, color: 'amber' },
    { name: 'Shared', icon: <FiShare2 />, color: 'rose' },
  ];

  const storageItems: StorageItem[] = [
    { type: 'Images', icon: <FiImage />, amount: '1.2 GB', color: 'blue' },
    { type: 'Documents', icon: <FiFile />, amount: '0.8 GB', color: 'emerald' },
    { type: 'Other', icon: <FiHardDrive />, amount: '1.5 GB', color: 'violet' },
  ];

  const recentFiles: FileItem[] = [
    { name: 'Presentation.pptx', icon: <FiFile />, size: '4.2 MB', time: '2 hours ago', color: 'blue', id: '1', download_url: '', preview_url: null, mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    { name: 'Vacation-Photo.jpg', icon: <FiImage />, size: '2.8 MB', time: 'Yesterday', color: 'emerald', id: '2', download_url: '', preview_url: null, mime_type: 'image/jpeg' },
    { name: 'Report-Q2.pdf', icon: <FiFile />, size: '8.5 MB', time: '2 days ago', color: 'rose', id: '3', download_url: '', preview_url: null, mime_type: 'application/pdf' },
    { name: 'Meeting-Notes.docx', icon: <FiFile />, size: '1.2 MB', time: '3 days ago', color: 'neutral', id: '4', download_url: '', preview_url: null, mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  ];

  const activityItems: ActivityItem[] = [
    { action: 'You uploaded Report-Q2.pdf', time: '2 hours ago', color: 'blue' },
    { action: 'You created folder Projects', time: 'Yesterday', color: 'amber' },
    { action: 'You shared Presentation.pptx', time: '3 days ago', color: 'purple' },
    { action: 'You updated Meeting-Notes.docx', time: '4 days ago', color: 'emerald' },
  ];

  // Create a list of file items from the fetched data
  const fileItems: FileItem[] = files.map(file => ({
    name: file.name,
    icon: getFileIcon(file.mime_type),
    size: formatFileSize(file.size),
    time: formatTimeSince(file.created_at),
    color: getFileColor(file.mime_type),
    id: file.id,
    download_url: file.download_url,
    preview_url: file.preview_url,
    mime_type: file.mime_type
  }));

  // Check if a file is an image
  const isImage = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  // Handle file click to preview images with improved preview handling
  const handleFileClick = async (file: FileItem) => {
    if (isImage(file.mime_type)) {
      setSelectedFile(file);
      setIsPreviewOpen(true);
    }
  };
  
  // Function to close preview
  const handleClosePreview = () => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
  };

  // Load thumbnails for image files
  useEffect(() => {
    const loadThumbnails = async () => {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return;
      
      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;
      
      const newThumbnailUrls: Record<string, string> = {};
      
      for (const file of files) {
        if (file.mime_type.startsWith('image/') && (file.preview_url || file.download_url)) {
          try {
            const url = file.preview_url || file.download_url;
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
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
    
    if (files.length > 0) {
      loadThumbnails();
    }
    
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailUrls).forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [files]);
  
  // Function to render a thumbnail safely
  const renderThumbnail = (file: FileItem) => {
    if (isImage(file.mime_type)) {
      const thumbnailUrl = thumbnailUrls[file.id];
      
      if (thumbnailUrl) {
        return (
          <div className="w-6 h-6 relative overflow-hidden rounded-sm">
            <div className={`absolute inset-0 ${getColorClasses(file.color, 'bg')}`}></div>
            <img 
              src={thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-cover z-10 relative"
              onError={(e) => {
                // Hide the image on error and show the icon
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        );
      }
    }
    
    return (
      <span className={getColorClasses(file.color, 'text')}>
        {file.icon}
      </span>
    );
  };
  
  // Remember to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any preview URL
      if (selectedFile?.preview_url) {
        window.URL.revokeObjectURL(selectedFile.preview_url);
      }
      
      // Clean up all thumbnail URLs
      Object.values(thumbnailUrls).forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [selectedFile, thumbnailUrls]);

  return (
    <motion.div
      className='flex flex-col lg:flex-row gap-6 p-6 lg:p-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='p-6 mx-auto space-y-8'>
        {/* Header */}
        <motion.div className='flex justify-between items-center' variants={itemVariants}>
          <div>
            <h1 className='text-3xl font-bold dark:text-neutral-100'>My Cloud</h1>
            <p className='text-neutral-600 dark:text-neutral-400'>Manage your files and storage</p>
          </div>
          <Link href="/cloud/upload">
            <button className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'>
              <FiUpload className='mr-2' />
              <span>Upload Files</span>
            </button>
          </Link>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4' variants={itemVariants}>
          {navigationItems.map((item) => {
            // Determine if this item should be a link
            const isLink = item.name === 'Photos';
            const content = (
              <div
                className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center cursor-pointer'
              >
                <div className={`w-12 h-12 rounded-full ${getColorClasses(item.color, 'bg')} flex items-center justify-center mb-3`}>
                  <span className={getColorClasses(item.color, 'text') + ' text-xl'}>
                    {item.icon}
                  </span>
                </div>
                <span className='text-sm font-medium dark:text-neutral-200'>{item.name}</span>
              </div>
            );

            return (
              <motion.div key={item.name}>
                {isLink ? (
                  <Link href="/cloud/photos" className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Storage Overview */}
        <motion.div className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
          <h2 className='text-xl font-semibold mb-4 dark:text-neutral-200'>Storage Overview</h2>
          <div className='flex items-center mb-2'>
            <div className='w-full'>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-gradient-to-r from-neutral-600 to-neutral-500 dark:from-neutral-500 dark:to-neutral-400 rounded-full'
                  style={{ width: '0%' }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                ></motion.div>
              </div>
            </div>
            <span className='ml-4 font-medium dark:text-neutral-200'>35%</span>
          </div>
          <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-4'>3.5 GB of 10 GB used</p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
            {storageItems.map((item) => (
              <div
                key={item.type}
                className='flex items-center p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700'
              >
                <div className='p-2 bg-neutral-200 dark:bg-neutral-700 rounded-md mr-3'>
                  <span className='text-neutral-600 dark:text-neutral-300'>{item.icon}</span>
                </div>
                <div>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>{item.type}</p>
                  <p className='font-medium dark:text-neutral-200'>{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Your Files Section */}
        <motion.div className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold dark:text-neutral-200'>Your Files</h2>
          </div>
          
          {loading ? (
            <div className='text-center py-10'>
              <p className='text-neutral-500 dark:text-neutral-400'>Loading your files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-neutral-500 dark:text-neutral-400'>You have no files yet. Start by uploading some!</p>
              <Link href="/cloud/upload">
                <button className='mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition'>
                  Upload Files
                </button>
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {fileItems.map((file) => (
                <div
                  key={`file-${file.id}`}
                  className='flex items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition cursor-pointer'
                  onClick={() => handleFileClick(file)}
                >
                  <div className={`p-2 ${getColorClasses(file.color, 'bg')} rounded-md mr-3`}>
                    {renderThumbnail(file)}
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium dark:text-neutral-200'>{file.name}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                      {file.size} • {file.time}
                    </p>
                  </div>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFileDownload(file.download_url, file.name);
                    }}
                    className='text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 mr-3'
                  >
                    <FiDownload />
                  </a>
                  <button
                    className='text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiShare2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Files & Activity */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Recent Files */}
          <motion.div className='md:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold dark:text-neutral-200'>Recent Files</h2>
              <button className='text-neutral-600 dark:text-neutral-400 text-sm font-medium'>
                View All
              </button>
            </div>
            <div className='space-y-3'>
              {recentFiles.map((file) => (
                <div
                  key={file.name}
                  className='flex items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition cursor-pointer'
                >
                  <div className={`p-2 ${getColorClasses(file.color, 'bg')} rounded-md mr-3`}>
                    <span className={getColorClasses(file.color, 'text')}>
                      {file.icon}
                    </span>
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium dark:text-neutral-200'>{file.name}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                      {file.size} • {file.time}
                    </p>
                  </div>
                  <button className='text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'>
                    <FiShare2 />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div className='bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6' variants={itemVariants}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold dark:text-neutral-200'>Activity</h2>
              <button className='text-neutral-600 dark:text-neutral-400 text-sm font-medium'>
                View All
              </button>
            </div>
            <div className='relative'>
              <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700'></div>
              <div className='space-y-6'>
                {activityItems.map((activity) => (
                  <div
                    key={activity.action}
                    className='relative pl-8'
                  >
                    <div className={`absolute left-0 p-1.5 ${getColorClasses(activity.color, 'bg').replace('bg-', 'bg-').replace('/30', '')} rounded-full z-10`}></div>
                    <p className='text-sm font-medium dark:text-neutral-200'>{activity.action}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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

export default CloudDashboard;