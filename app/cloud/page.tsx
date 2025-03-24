'use client';
import FilePreview from '@/components/cloud/preview';
import { Directory, FileData } from '@/helpers/props';
import { formatBytes, formatTimeSince } from '@/helpers/utils';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiChevronRight,
  FiDownload,
  FiFile,
  FiFolder,
  FiGrid,
  FiHome,
  FiImage,
  FiList,
  FiMusic,
  FiPlus,
  FiShare2,
  FiUpload,
  FiVideo,
} from 'react-icons/fi';

// Interfaces
interface BreadcrumbItem {
  id: string | null;
  name: string;
  path: string;
}

const CloudExplorer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useAxios();
  const { toast } = useToast();

  // Get current directory from URL query parameter
  const currentDirId = searchParams.get('dir') || null;

  // States
  const [loading, setLoading] = useState(true);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Home', path: '' }]);
  const [currentDirectory, setCurrentDirectory] = useState<Directory | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);

  // Load current directory details and its contents
  useEffect(() => {
    const fetchDirectoryContents = async () => {
      try {
        setLoading(true);

        // Get directories in current directory
        const dirResponse = await api.get('/api/cloud/directories/', {
          params: { parent: currentDirId },
        });
        setDirectories(dirResponse.data || []);

        // If we're in a subdirectory, get its details for breadcrumb
        if (currentDirId) {
          try {
            const dirDetailsResponse = await api.get(`/api/cloud/directories/${currentDirId}/`);
            setCurrentDirectory(dirDetailsResponse.data);

            // Build breadcrumb path
            if (dirDetailsResponse.data?.path) {
              const pathParts: string[] = dirDetailsResponse.data.path.split('/').filter((part: string) => part.trim());
              const newBreadcrumbs: BreadcrumbItem[] = [{ id: null, name: 'Home', path: '' }];

              if (pathParts.length > 0) {
                // Fetch all parent directories in a single API call
                try {
                  const pathStr = pathParts.join('/');
                  const pathResponse = await api.get('/api/cloud/directories/path/', {
                    params: { path: pathStr },
                  });

                  // Add each directory to breadcrumbs with correct ID
                  const pathDirectories = pathResponse.data || [];
                  let currentPath = '';

                  pathDirectories.forEach((dir: any) => {
                    currentPath += (currentPath ? '/' : '') + dir.name;
                    newBreadcrumbs.push({
                      id: dir.id,
                      name: dir.name,
                      path: currentPath,
                    });
                  });
                } catch (pathError) {
                  console.error('Error fetching path directories:', pathError);

                  // Fallback method: Add the final directory that we know
                  newBreadcrumbs.push({
                    id: dirDetailsResponse.data.id,
                    name: pathParts[pathParts.length - 1],
                    path: dirDetailsResponse.data.path,
                  });
                }
              }

              setBreadcrumbs(newBreadcrumbs);
            }
          } catch (error) {
            console.error('Error fetching directory details:', error);
            // Reset to home if directory not found
            router.push('/cloud');
          }
        } else {
          // Reset breadcrumbs to home when in root
          setBreadcrumbs([{ id: null, name: 'Home', path: '' }]);
          setCurrentDirectory(null);
        }

        // Get files in current directory
        const fileResponse = await api.get('/api/cloud/files/', {
          params: { parent: currentDirId },
        });
        setFiles(fileResponse.data || []);
      } catch (error) {
        console.error('Error fetching directory contents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load directory contents',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryContents();
  }, [currentDirId]);

  // Load thumbnails for image files
  useEffect(() => {
    const loadThumbnails = async () => {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return;

      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;

      const newThumbnailUrls: Record<string, string> = {};

      for (const file of files) {
        if (file.mime_type?.startsWith('image/') && (file.preview_url || file.download_url)) {
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

      setThumbnailUrls((prevUrls) => {
        // Revoke old URLs that are no longer needed
        Object.entries(prevUrls).forEach(([id, url]) => {
          if (!newThumbnailUrls[id]) {
            URL.revokeObjectURL(url);
          }
        });
        return { ...newThumbnailUrls };
      });
    };

    if (files.length > 0) {
      loadThumbnails();
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  // Navigate to a directory
  const navigateToDirectory = (dirId: string | null) => {
    if (dirId) {
      router.push(`/cloud?dir=${dirId}`);
    } else {
      router.push('/cloud');
    }
  };

  // File download handler
  const handleFileDownload = async (downloadUrl: string, fileName: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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

      // Show loading toast
      toast({
        title: 'Downloading...',
        description: `Preparing ${fileName} for download`,
      });

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

      // Show success toast
      toast({
        title: 'Download Complete',
        description: `${fileName} has been downloaded`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the file',
        variant: 'destructive',
      });
    }
  };

  // File click handler
  const handleFileClick = (file: FileData, index: number) => {
    // For images, open the preview
    if (file.mime_type?.startsWith('image/')) {
      setSelectedFile(file);
      setSelectedFileIndex(index);
      setIsPreviewOpen(true);
    } else {
      // For other files, download them
      handleFileDownload(file.download_url, file.name);
    }
  };

  // Close preview handler
  const handleClosePreview = () => {
    setSelectedFile(null);
    setSelectedFileIndex(-1);
    setIsPreviewOpen(false);
  };

  // Navigation for preview
  const handleNextFile = () => {
    const imageFiles = files.filter((file) => file.mime_type?.startsWith('image/'));
    if (selectedFileIndex < imageFiles.length - 1) {
      const nextIndex = selectedFileIndex + 1;
      setSelectedFileIndex(nextIndex);
      setSelectedFile(imageFiles[nextIndex]);
    }
  };

  const handlePreviousFile = () => {
    const imageFiles = files.filter((file) => file.mime_type?.startsWith('image/'));
    if (selectedFileIndex > 0) {
      const prevIndex = selectedFileIndex - 1;
      setSelectedFileIndex(prevIndex);
      setSelectedFile(imageFiles[prevIndex]);
    }
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (!mimeType) return <FiFile className='w-5 h-5' />;

    if (mimeType.startsWith('image/')) {
      return <FiImage className='w-5 h-5' />;
    } else if (mimeType.startsWith('video/')) {
      return <FiVideo className='w-5 h-5' />;
    } else if (mimeType.startsWith('audio/')) {
      return <FiMusic className='w-5 h-5' />;
    } else {
      return <FiFile className='w-5 h-5' />;
    }
  };

  // Get color class based on item type
  const getColorClass = (item: FileData | Directory) => {
    if ('mime_type' in item) {
      // It's a file
      const { mime_type } = item;
      if (!mime_type) return 'text-neutral-500';

      if (mime_type.startsWith('image/')) {
        return 'text-emerald-500';
      } else if (mime_type.startsWith('video/')) {
        return 'text-blue-500';
      } else if (mime_type.startsWith('audio/')) {
        return 'text-purple-500';
      } else if (mime_type.includes('pdf')) {
        return 'text-red-500';
      } else if (mime_type.includes('document') || mime_type.includes('word')) {
        return 'text-blue-500';
      } else if (mime_type.includes('spreadsheet') || mime_type.includes('excel')) {
        return 'text-green-500';
      } else if (mime_type.includes('presentation') || mime_type.includes('powerpoint')) {
        return 'text-amber-500';
      }
      return 'text-neutral-500';
    } else {
      // It's a directory
      return 'text-amber-500';
    }
  };

  // Get background color class
  const getBgColorClass = (item: FileData | Directory) => {
    if ('mime_type' in item) {
      // It's a file
      const { mime_type } = item;
      if (!mime_type) return 'bg-neutral-100 dark:bg-neutral-800';

      if (mime_type.startsWith('image/')) {
        return 'bg-emerald-50 dark:bg-emerald-900/20';
      } else if (mime_type.startsWith('video/')) {
        return 'bg-blue-50 dark:bg-blue-900/20';
      } else if (mime_type.startsWith('audio/')) {
        return 'bg-purple-50 dark:bg-purple-900/20';
      } else if (mime_type.includes('pdf')) {
        return 'bg-red-50 dark:bg-red-900/20';
      } else if (mime_type.includes('document') || mime_type.includes('word')) {
        return 'bg-blue-50 dark:bg-blue-900/20';
      } else if (mime_type.includes('spreadsheet') || mime_type.includes('excel')) {
        return 'bg-green-50 dark:bg-green-900/20';
      } else if (mime_type.includes('presentation') || mime_type.includes('powerpoint')) {
        return 'bg-amber-50 dark:bg-amber-900/20';
      }
      return 'bg-neutral-100 dark:bg-neutral-800';
    } else {
      // It's a directory
      return 'bg-amber-50 dark:bg-amber-900/20';
    }
  };

  // Render thumbnail or icon
  const renderThumbnailOrIcon = (file: FileData) => {
    if (file.mime_type?.startsWith('image/') && thumbnailUrls[file.id]) {
      return (
        <div className='w-full h-full overflow-hidden'>
          <img src={thumbnailUrls[file.id]} alt={file.name} className='w-full h-full object-cover' />
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex items-center justify-center ${getColorClass(file)}`}>{getFileIcon(file.mime_type)}</div>
    );
  };

  // Grid view item render function
  const renderGridItem = (item: FileData | Directory, isDirectory = false, index = 0) => {
    return (
      <div
        key={item.id}
        className='group relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-sm hover:shadow-md'
        onClick={() => (isDirectory ? navigateToDirectory(item.id) : handleFileClick(item as FileData, index))}
      >
        <div className='flex flex-col'>
          {/* Thumbnail/Icon container */}
          <div className={`aspect-square ${getBgColorClass(item)}`}>
            {isDirectory ? (
              <div className='w-full h-full flex items-center justify-center text-amber-500'>
                <FiFolder className='w-12 h-12' />
              </div>
            ) : (
              renderThumbnailOrIcon(item as FileData)
            )}
          </div>

          {/* Info bar */}
          <div className='p-3 bg-white dark:bg-neutral-900'>
            <div className='font-medium text-neutral-800 dark:text-neutral-200 truncate'>{item.name}</div>
            <div className='text-xs text-neutral-500 dark:text-neutral-400 flex justify-between'>
              <span>{formatTimeSince(item.created_at)}</span>
              {'size' in item && <span>{formatBytes(item.size)}</span>}
            </div>
          </div>
        </div>

        {/* Hover actions */}
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          {!isDirectory && (
            <button
              className='p-1.5 bg-white/90 dark:bg-neutral-800/90 rounded-full shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition'
              onClick={(e) => {
                e.stopPropagation();
                handleFileDownload((item as FileData).download_url, item.name, e);
              }}
            >
              <FiDownload className='w-4 h-4 text-neutral-700 dark:text-neutral-300' />
            </button>
          )}
        </div>
      </div>
    );
  };

  // List view item render function
  const renderListItem = (item: FileData | Directory, isDirectory = false, index = 0) => {
    return (
      <div
        key={item.id}
        className='flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer transition'
        onClick={() => (isDirectory ? navigateToDirectory(item.id) : handleFileClick(item as FileData, index))}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${getBgColorClass(item)} rounded-md flex items-center justify-center mr-3`}>
          {isDirectory ? <FiFolder className={`w-5 h-5 ${getColorClass(item)}`} /> : getFileIcon((item as FileData).mime_type)}
        </div>

        {/* Name and info */}
        <div className='flex-grow min-w-0'>
          <div className='font-medium text-neutral-800 dark:text-neutral-200 truncate'>{item.name}</div>
          <div className='text-xs text-neutral-500 dark:text-neutral-400'>{formatTimeSince(item.created_at)}</div>
        </div>

        {/* Size for files */}
        {'size' in item && (
          <div className='w-24 text-right text-sm text-neutral-600 dark:text-neutral-400'>{formatBytes(item.size)}</div>
        )}

        {/* Actions */}
        <div className='flex space-x-2 ml-4'>
          {!isDirectory && (
            <button
              className='p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition'
              onClick={(e) => {
                e.stopPropagation();
                handleFileDownload((item as FileData).download_url, item.name, e);
              }}
            >
              <FiDownload className='w-4 h-4' />
            </button>
          )}
          <button
            className='p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition'
            onClick={(e) => e.stopPropagation()}
          >
            <FiShare2 className='w-4 h-4' />
          </button>
        </div>
      </div>
    );
  };

  // Get filtered image files for preview navigation
  const imageFiles = files.filter((file) => file.mime_type?.startsWith('image/'));

  return (
    <div className='flex grow flex-col'>
      {/* Main content container */}
      <div className='flex flex-col grow py-6 mx-auto space-y-8 w-full max-w-7xl'>
        {/* Header section */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold dark:text-neutral-100'>My Files</h1>
            <p className='text-neutral-600 dark:text-neutral-400'>Access and manage your secure cloud storage</p>
          </div>

          <div className='flex items-center space-x-3'>
            {/* View mode toggle */}
            <div className='border border-neutral-200 dark:border-neutral-700 rounded-md flex'>
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'} transition`}
                onClick={() => setViewMode('grid')}
                title='Grid view'
              >
                <FiGrid className='w-4 h-4' />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'} transition`}
                onClick={() => setViewMode('list')}
                title='List view'
              >
                <FiList className='w-4 h-4' />
              </button>
            </div>

            {/* Upload button */}
            <Link
              href='/cloud/upload'
              className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'
            >
              <FiUpload className='mr-2 w-4 h-4' />
              <span>Upload</span>
            </Link>

            {/* New folder button */}
            <button className='flex items-center bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 px-3 py-2 rounded-md transition shadow-sm'>
              <FiPlus className='mr-2 w-4 h-4' />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb navigation */}
        <div className='bg-white dark:bg-neutral-900 rounded-lg p-3 shadow-sm'>
          <div className='flex items-center text-sm overflow-x-auto whitespace-nowrap'>
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.id}-${index}`} className='flex items-center'>
                {index > 0 && <FiChevronRight className='mx-2 text-neutral-400 dark:text-neutral-500 flex-shrink-0' />}
                <button
                  className={`hover:bg-neutral-100 dark:hover:bg-neutral-700 px-2 py-1 rounded transition ${
                    index === breadcrumbs.length - 1
                      ? 'font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                  onClick={() => navigateToDirectory(crumb.id)}
                >
                  {index === 0 ? (
                    <span className='flex items-center'>
                      <FiHome className='mr-1.5 flex-shrink-0' />
                      {crumb.name}
                    </span>
                  ) : (
                    crumb.name
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className='bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm flex-grow'>
          {loading ? (
            <div className='w-full'>
              {viewMode === 'grid' ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                  {/* Skeleton loaders for grid view */}
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className='rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700'>
                      <div className='aspect-square bg-neutral-200 dark:bg-neutral-800 animate-pulse'></div>
                      <div className='p-3 bg-white dark:bg-neutral-900'>
                        <div className='h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2 animate-pulse'></div>
                        <div className='h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 animate-pulse'></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-white dark:bg-neutral-800 rounded-md overflow-hidden'>
                  {/* Header row for list view */}
                  <div className='px-4 py-3 bg-neutral-100 dark:bg-neutral-800/90 border-b border-neutral-200 dark:border-neutral-700 flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300'>
                    <div className='w-10 mr-3'></div>
                    <div className='flex-grow'>Name</div>
                    <div className='w-24 text-right'>Size</div>
                    <div className='ml-4 w-20'>Actions</div>
                  </div>

                  {/* Skeleton loaders for list view */}
                  <div>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className='flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700'>
                        <div className='flex-shrink-0 w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-md mr-3 animate-pulse'></div>
                        <div className='flex-grow'>
                          <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-1/3 animate-pulse'></div>
                          <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse'></div>
                        </div>
                        <div className='w-24 h-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse'></div>
                        <div className='flex space-x-2 ml-4'>
                          <div className='w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse'></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {directories.length === 0 && files.length === 0 ? (
                <div className='text-center py-16'>
                  <div className='text-neutral-400 dark:text-neutral-500 mb-4'>
                    <FiFolder className='w-16 h-16 mx-auto' />
                  </div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2'>This folder is empty</h3>
                  <p className='text-neutral-600 dark:text-neutral-400 mb-6'>Upload files or create a new folder to get started</p>
                  <div className='flex justify-center space-x-4'>
                    <Link
                      href='/cloud/upload'
                      className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-4 py-2 rounded-md transition shadow-sm'
                    >
                      <FiUpload className='mr-2 w-4 h-4' />
                      <span>Upload Files</span>
                    </Link>
                    <button className='flex items-center bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 px-4 py-2 rounded-md transition shadow-sm'>
                      <FiPlus className='mr-2 w-4 h-4' />
                      <span>New Folder</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                      {/* Directories first */}
                      {directories.map((dir, index) => renderGridItem(dir, true, index))}

                      {/* Then files */}
                      {files.map((file, index) => renderGridItem(file, false, directories.length + index))}
                    </div>
                  ) : (
                    <div className='bg-white dark:bg-neutral-800 rounded-md overflow-hidden'>
                      {/* Header row */}
                      <div className='px-4 py-3 bg-neutral-100 dark:bg-neutral-800/90 border-b border-neutral-200 dark:border-neutral-700 flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300'>
                        <div className='w-10 mr-3'></div>
                        <div className='flex-grow'>Name</div>
                        <div className='w-24 text-right'>Size</div>
                        <div className='ml-4 w-20'>Actions</div>
                      </div>

                      <div>
                        {/* Directory items */}
                        {directories.map((dir, index) => renderListItem(dir, true, index))}

                        {/* File items */}
                        {files.map((file, index) => renderListItem(file, false, directories.length + index))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <FilePreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        file={
          selectedFile
            ? {
                id: selectedFile.id,
                name: selectedFile.name,
                size: formatBytes(selectedFile.size),
                time: formatTimeSince(selectedFile.created_at),
                download_url: selectedFile.download_url,
                mime_type: selectedFile.mime_type,
              }
            : null
        }
        onDownload={(url, name) => handleFileDownload(url, name)}
        onNext={handleNextFile}
        onPrevious={handlePreviousFile}
        hasNext={selectedFileIndex < imageFiles.length - 1}
        hasPrevious={selectedFileIndex > 0}
      />
    </div>
  );
};

export default CloudExplorer;
