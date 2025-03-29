import { Directory, FileData, MediaItem } from '@/helpers/props';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Interfaces
export interface BreadcrumbItem {
  id: string | null;
  name: string;
  path: string;
}

export interface UseCloudOptions {
  initialDirectoryId?: string | null;
  autoFetch?: boolean;
}

export interface UploadOptions {
  parent?: string | null;
  autoOrganize?: boolean;
  onProgress?: (progress: number) => void;
}

export default function useCloud(options: UseCloudOptions = {}) {
  const {
    initialDirectoryId = null,
    autoFetch = true,
  } = options;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useAxios();
  const { toast } = useToast();

  // Get current directory from URL query parameter or use provided initialDirectoryId
  const currentDirId = searchParams?.get('dir') || initialDirectoryId;

  // States
  const [loading, setLoading] = useState(true);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Home', path: '' }]);
  const [currentDirectory, setCurrentDirectory] = useState<Directory | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [draggingOverDirId, setDraggingOverDirId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // References
  const dragTargetRef = useRef<EventTarget | null>(null);
  const dragCounter = useRef(0);

  // Function to fetch directory contents
  const fetchDirectoryContents = async (directoryId: string | null = currentDirId) => {
    try {
      setLoading(true);

      // Get directories in current directory
      const dirResponse = await api.get('/api/cloud/directories/', {
        params: { parent: directoryId },
      });
      setDirectories(dirResponse.data || []);

      // If we're in a subdirectory, get its details for breadcrumb
      if (directoryId) {
        try {
          const dirDetailsResponse = await api.get(`/api/cloud/directories/${directoryId}/`);
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
        params: { parent: directoryId },
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

  // Function to fetch media files for gallery
  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cloud/gallery/');
      // Filter for both image and video files
      const filteredFiles = response.data.filter(
        (file: FileData) => 
          file.mime_type.startsWith('image/') || 
          file.mime_type.startsWith('video/')
      );
      setFiles(filteredFiles);
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

  // Load thumbnails for media files
  const loadThumbnails = async (filesToLoad: FileData[] = files) => {
    const authTokensStr = localStorage.getItem('authTokens');
    if (!authTokensStr) return;

    const authTokens = JSON.parse(authTokensStr);
    const accessToken = authTokens.access;

    const newThumbnailUrls: Record<string, string> = {};

    for (const file of filesToLoad) {
      const isMediaFile = file.mime_type?.startsWith('image/') || file.mime_type?.startsWith('video/');
      if (isMediaFile && (file.preview_url || file.download_url)) {
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
      return { ...prevUrls, ...newThumbnailUrls };
    });
  };

  // Function to clean up thumbnail URLs
  const cleanupThumbnails = () => {
    Object.values(thumbnailUrls).forEach((url) => {
      URL.revokeObjectURL(url);
    });
    setThumbnailUrls({});
  };

  // Navigate to a directory
  const navigateToDirectory = (dirId: string | null) => {
    if (dirId) {
      router.push(`/cloud?dir=${dirId}`);
    } else {
      router.push('/cloud');
    }
  };

  // File download handler
  const downloadFile = async (downloadUrl: string, fileName: string): Promise<boolean> => {
    try {
      // Get auth token from localStorage
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        toast({
          title: 'Authentication Error',
          description: 'You need to be logged in to download files',
          variant: 'destructive',
        });
        return false;
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
      
      return true;
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the file',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Upload files
  const uploadFiles = async (files: File[], options: UploadOptions = {}): Promise<boolean> => {
    if (files.length === 0) return false;
    
    const { 
      parent = currentDirId, 
      autoOrganize = true,
      onProgress
    } = options;
    
    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      
      // Add files to form data
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Set parent directory
      formData.append('parent', parent || '');
      
      // Set auto-organize flag
      formData.append('auto_organize', autoOrganize.toString());
      
      // Show in-progress toast
      toast({
        title: 'Uploading files',
        description: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`,
      });
      
      // Upload files
      const response = await api.post('/api/cloud/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            
            // Apply the same progress to all files
            const updatedProgress: Record<string, number> = {};
            files.forEach(file => {
              updatedProgress[file.name] = percentCompleted;
            });
            setUploadProgress(prev => ({ ...prev, ...updatedProgress }));
            
            // Call the onProgress callback if provided
            if (onProgress) {
              onProgress(percentCompleted);
            }
          }
        },
      });
      
      // Mark all files as completed
      const completedProgress: Record<string, number> = {};
      files.forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(prev => ({ ...prev, ...completedProgress }));
      
      // Show success toast
      toast({
        title: 'Upload complete',
        description: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}`,
      });
      
      // Refresh the content to show new files
      if (autoOrganize) {
        // If auto-organizing, need to fetch all directories again
        await fetchDirectoryContents();
      } else {
        // If not auto-organizing, just fetch files in the current directory
        const fileResponse = await api.get('/api/cloud/files/', {
          params: { parent: currentDirId },
        });
        setFiles(fileResponse.data || []);
      }
      
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files',
        variant: 'destructive',
      });
      
      // Mark all files as failed
      const failedProgress: Record<string, number> = {};
      files.forEach(file => {
        failedProgress[file.name] = -1;
      });
      setUploadProgress(prev => ({ ...prev, ...failedProgress }));
      
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Preview handling functions
  const openFilePreview = (file: FileData | MediaItem, index: number) => {
    setSelectedFile(file as FileData);
    setSelectedFileIndex(index);
    setIsPreviewOpen(true);
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
    setSelectedFileIndex(-1);
    setIsPreviewOpen(false);
  };

  const nextFilePreview = () => {
    const mediaFiles = files.filter((file) => 
      file.mime_type?.startsWith('image/') || file.mime_type?.startsWith('video/')
    );
    if (selectedFileIndex < mediaFiles.length - 1) {
      const nextIndex = selectedFileIndex + 1;
      setSelectedFileIndex(nextIndex);
      setSelectedFile(mediaFiles[nextIndex]);
    }
  };

  const previousFilePreview = () => {
    const mediaFiles = files.filter((file) => 
      file.mime_type?.startsWith('image/') || file.mime_type?.startsWith('video/')
    );
    if (selectedFileIndex > 0) {
      const prevIndex = selectedFileIndex - 1;
      setSelectedFileIndex(prevIndex);
      setSelectedFile(mediaFiles[prevIndex]);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLElement>, dirId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragTargetRef.current = e.target;
    dragCounter.current += 1;
    
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
      if (dirId) {
        setDraggingOverDirId(dirId);
      }
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current -= 1;
    
    // Only update state if this is the same element that triggered dragEnter
    if (dragTargetRef.current === e.target) {
      dragTargetRef.current = null;
    }
    
    // Only reset if all drag events are complete
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      setDraggingOverDirId(null);
      dragCounter.current = 0;
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLElement>, dirId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dirId && dirId !== draggingOverDirId) {
      setDraggingOverDirId(dirId);
    }
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLElement>, dirId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag state
    setIsDragging(false);
    setDraggingOverDirId(null);
    dragCounter.current = 0;
    dragTargetRef.current = null;
    
    // Check if files were dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      // Upload files to the directory they were dropped on or current directory
      await uploadFiles(droppedFiles, {
        parent: dirId || currentDirId,
        autoOrganize: false
      });
    }
  };

  // Utility functions
  const getFileIcon = (mimeType: string) => {
    if (!mimeType) return 'file';
    
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    } else if (mimeType.includes('pdf')) {
      return 'pdf';
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return 'document';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'spreadsheet';
    } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return 'presentation';
    }
    return 'file';
  };

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

  // Auto-fetch directory contents or media files on mount and when currentDirId changes
  useEffect(() => {
    if (autoFetch) {
      fetchDirectoryContents();
    }
    
    // Cleanup function
    return () => {
      cleanupThumbnails();
    };
  }, [currentDirId, autoFetch]);

  // Load thumbnails when files change
  useEffect(() => {
    if (files.length > 0) {
      loadThumbnails();
    }
  }, [files]);

  return {
    // State
    loading,
    directories,
    files,
    selectedFile,
    isPreviewOpen,
    thumbnailUrls,
    breadcrumbs,
    currentDirectory,
    currentDirId,
    selectedFileIndex,
    isDragging,
    draggingOverDirId,
    isUploading,
    uploadProgress,
    
    // File operations
    fetchDirectoryContents,
    fetchMediaFiles,
    navigateToDirectory,
    downloadFile,
    uploadFiles,
    
    // Preview handling
    openFilePreview,
    closeFilePreview,
    nextFilePreview,
    previousFilePreview,
    
    // Drag and drop handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    
    // Utility functions
    getFileIcon,
    getColorClass,
    getBgColorClass,
    loadThumbnails,
    cleanupThumbnails
  };
}
