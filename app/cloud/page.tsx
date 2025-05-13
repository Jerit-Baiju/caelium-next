'use client';

import CloudEmptyState from '@/components/cloud/CloudEmptyState';
import CloudTagModal from '@/components/cloud/CloudTagModal';
import EmptySpaceContextMenu from '@/components/cloud/context-menus/EmptySpaceContextMenu';
import FileContextMenu from '@/components/cloud/context-menus/file-context';
import FolderContextMenu from '@/components/cloud/context-menus/FolderContextMenu';
import ItemSkeleton from '@/components/cloud/ItemSkeleton';
import FilePreview from '@/components/cloud/preview';
import { BreadcrumbItem, ExplorerData, FileData } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import useCloud from '@/hooks/useCloud';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiArchive,
  FiChevronRight,
  FiCode,
  FiFile,
  FiFileText,
  FiFolder,
  FiHome,
  FiImage,
  FiMusic,
  FiTag,
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

  // Tag modal state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

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

  // Marquee selection states
  const [selectionBox, setSelectionBox] = useState<null | { x: number; y: number; w: number; h: number }>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  // Store refs for all file/folder cards
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Store the base selection for additive marquee
  const baseSelectedIdsRef = useRef<Set<string>>(new Set());
  const marqueeAdditiveRef = useRef(false);

  // Mouse event handlers for marquee selection
  const selectionStart = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click, and not on a child element (avoid context menu, etc)
    if (e.button !== 0 || e.target !== gridRef.current) return;
    setIsSelecting(true);
    const rect = gridRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);
    selectionStart.current = { x, y };
    setSelectionBox({ x, y, w: 0, h: 0 });
    // If Ctrl/Cmd/Shift is held, store the current selection for additive marquee
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      baseSelectedIdsRef.current = new Set(selectedIds);
      marqueeAdditiveRef.current = true;
    } else {
      baseSelectedIdsRef.current = new Set();
      marqueeAdditiveRef.current = false;
      setSelectedIds(new Set());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart.current || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const startX = selectionStart.current.x;
    const startY = selectionStart.current.y;
    const box = {
      x: Math.min(x, startX),
      y: Math.min(y, startY),
      w: Math.abs(x - startX),
      h: Math.abs(y - startY),
    };
    setSelectionBox(box);
    // Check intersection for all items
    const marqueeSelected = new Set<string>();
    // Directories
    explorerData.directories.forEach((dir) => {
      const ref = itemRefs.current[dir.id];
      if (ref) {
        const r = ref.getBoundingClientRect();
        const parentRect = gridRef.current!.getBoundingClientRect();
        const rel = {
          left: r.left - parentRect.left,
          top: r.top - parentRect.top,
          right: r.right - parentRect.left,
          bottom: r.bottom - parentRect.top,
        };
        if (box.x < rel.right && box.x + box.w > rel.left && box.y < rel.bottom && box.y + box.h > rel.top) {
          marqueeSelected.add(dir.id);
        }
      }
    });
    // Files
    explorerData.files.forEach((file) => {
      const ref = itemRefs.current[file.id];
      if (ref) {
        const r = ref.getBoundingClientRect();
        const parentRect = gridRef.current!.getBoundingClientRect();
        const rel = {
          left: r.left - parentRect.left,
          top: r.top - parentRect.top,
          right: r.right - parentRect.left,
          bottom: r.bottom - parentRect.top,
        };
        if (box.x < rel.right && box.x + box.w > rel.left && box.y < rel.bottom && box.y + box.h > rel.top) {
          marqueeSelected.add(file.id);
        }
      }
    });
    if (marqueeAdditiveRef.current) {
      // Toggle selection: deselect if already selected, select if not
      const merged = new Set(baseSelectedIdsRef.current);
      marqueeSelected.forEach((id) => {
        if (baseSelectedIdsRef.current.has(id)) {
          merged.delete(id);
        } else {
          merged.add(id);
        }
      });
      setSelectedIds(merged);
    } else {
      setSelectedIds(marqueeSelected);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionBox(null);
    selectionStart.current = null;
    marqueeAdditiveRef.current = false;
  };

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

  // Tag related handlers
  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleApplyTags = (tagIds: string[]) => {
    // In a real implementation, this would call an API to tag the files
    console.log('Applied tags', tagIds, 'to items', Array.from(selectedIds));
    // You would then refresh the data or update the UI
    // For now, just close the modal
    setIsTagModalOpen(false);
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

      // Handle each image as it loads
      const handleImageLoaded = (fileId: string, url: string) => {
        setImageUrls((prevUrls) => ({
          ...prevUrls,
          [fileId]: url,
        }));

        imageUrlsCacheRef.current = {
          ...imageUrlsCacheRef.current,
          [fileId]: url,
        };
      };

      for (let i = 0; i < filesToFetch.length; i += 5) {
        const batch = filesToFetch.slice(i, i + 5);
        try {
          // Pass the callback to handle each image as it loads
          await fetchImageUrls(batch, handleImageLoaded);
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
    setSelectedIds(new Set()); // Clear selection when navigating
  };

  const navigateToBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    const dirId = breadcrumb.id;
    const params = new URLSearchParams();
    if (dirId) params.set('dir', dirId);
    router.push(`/cloud?${params.toString()}`);
    setCurrentPath(dirId);
    setSelectedIds(new Set()); // Clear selection when navigating
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

  // End of file download handler

  const handleCreateFolder = async (name: string) => {
    // TODO: Implement API call to create folder
    // For now, just log and refresh
    console.log('Create folder:', name, 'in', currentPath);
    // Simulate refresh
    // await fetchExplorerData(currentPath)
  };

  const handleShareCurrentFolder = () => {
    // TODO: Implement share logic for current folder
    // For now, just log
    console.log('Share folder:', currentPath);
  };

  return (
    <div className='flex grow flex-col max-w-7xl mx-auto'>
      {/* Header Section */}
      <div className='rounded-xl px-6 pt-6'>
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

          {/* Button area: Upload or Management, with framer-motion animation */}
          {!loading && (explorerData.directories.length > 0 || explorerData.files.length > 0) && (
            <motion.div className='flex items-center gap-3 min-w-[120px]' initial={false}>
              <motion.div style={{ position: 'relative', minWidth: 120 }}>
                <motion.div
                  key={selectedIds.size > 0 ? 'manage' : 'upload'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {selectedIds.size > 0 ? (
                    <div className='flex gap-2'>
                      {/* Management buttons with neutral theme */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-2 border-white border-2 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200'
                        // onClick={handleDeleteSelected} // implement as needed
                      >
                        <FiX size={18} />
                        <span>Delete</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-2 border-white border-2 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200'
                        // onClick={handleMoveSelected} // implement as needed
                      >
                        <FiFolder size={18} />
                        <span>Move</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-2 border-white border-2 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200'
                        onClick={handleOpenTagModal}
                      >
                        <FiTag size={18} />
                        <span>Tag</span>
                      </motion.button>
                    </div>
                  ) : (
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
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className='flex items-center mb-0 shadow-sm backdrop-blur-sm rounded-xl px-4 min-h-[48px] overflow-hidden border border-neutral-100 dark:border-neutral-700'>
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
            <div className='flex items-center w-full overflow-x-auto scrollbar-hide scroll-smooth py-1'>
              <div className='flex items-center min-w-fit flex-nowrap'>
                <button
                  onClick={() => navigateToDirectory('')}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-all duration-200 flex-shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                >
                  <FiHome className='flex-shrink-0' size={15} />
                  <span className='text-sm whitespace-nowrap'>Home</span>
                </button>

                {explorerData.breadcrumbs.map((breadcrumb, index) => (
                  <div key={index} className='flex items-center flex-shrink-0'>
                    <span className='mx-1 text-neutral-400 dark:text-neutral-500'>
                      <FiChevronRight className='flex-shrink-0' size={14} />
                    </span>
                    <button
                      onClick={() => navigateToBreadcrumb(breadcrumb)}
                      className={`py-1.5 px-3 rounded-lg text-sm transition-all duration-200 flex items-center 
                      hover:bg-neutral-100 dark:hover:bg-neutral-800
                      ${index === explorerData.breadcrumbs.length - 1 ? 'font-medium text-blue-500' : ''}`}
                    >
                      <span className='truncate max-w-[100px] sm:max-w-[120px] md:max-w-[160px]' title={breadcrumb.name}>
                        {breadcrumb.name}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='grow'>
        {loading ? (
          <ItemSkeleton />
        ) : explorerData.directories.length === 0 && explorerData.files.length === 0 ? (
          <CloudEmptyState />
        ) : (
          <EmptySpaceContextMenu
            currentFolderId={currentPath || null}
            onCreateFolder={handleCreateFolder}
            onShareFolder={handleShareCurrentFolder}
          >
            <div className='mx-6 min-h-[calc(100dvh-16rem)] rounded-xl'>
              <div
                ref={gridRef}
                className='grid p-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 relative select-none'
                style={{ userSelect: isSelecting ? 'none' : undefined }}
                onMouseDown={handleMouseDown}
                onMouseMove={isSelecting ? handleMouseMove : undefined}
                onMouseUp={isSelecting ? handleMouseUp : undefined}
              >
                {/* Selection rectangle overlay */}
                {isSelecting && selectionBox && (
                  <div
                    style={{
                      position: 'absolute',
                      left: selectionBox.x,
                      top: selectionBox.y,
                      width: selectionBox.w,
                      height: selectionBox.h,
                      background: 'rgba(59,130,246,0.15)',
                      border: '2px solid #3b82f6',
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {/* Directories */}
                {explorerData.directories.map((directory) => (
                  <FolderContextMenu
                    key={directory.id}
                    folder={{
                      id: directory.id,
                      name: directory.name,
                      parent: currentPath || null,
                    }}
                    onRename={(id, newName) => {
                      // TODO: Implement folder rename logic
                      console.log('Rename folder', id, 'to', newName);
                    }}
                    onDelete={(id) => {
                      // TODO: Implement folder delete logic
                      console.log('Delete folder', id);
                    }}
                    onShare={(id) => {
                      // TODO: Implement folder share logic
                      console.log('Share folder', id);
                    }}
                    onMove={(id) => {
                      // TODO: Implement folder move logic
                      console.log('Move folder', id);
                    }}
                    onCopy={(id) => {
                      // TODO: Implement folder copy logic
                      console.log('Copy folder', id);
                    }}
                    onCreateSubfolder={(parentId, name) => {
                      // TODO: Implement create subfolder logic
                      console.log('Create subfolder', name, 'in', parentId);
                    }}
                  >
                    <div
                      ref={(el) => {
                        itemRefs.current[directory.id] = el;
                      }}
                      className={`group relative bg-neutral-50 dark:bg-neutral-900 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:shadow-md ${selectedIds.has(directory.id) ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-950' : ''}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey) {
                          // When meta/ctrl key is pressed, toggle selection without navigation
                          setSelectedIds((prev) => {
                            const newSet = new Set(prev);
                            if (newSet.has(directory.id)) {
                              newSet.delete(directory.id);
                            } else {
                              newSet.add(directory.id);
                            }
                            return newSet;
                          });
                        } else {
                          // Regular click should just navigate without setting selection
                          // Selection will be cleared by the navigateToDirectory function
                          navigateToDirectory(directory.id);
                        }
                        e.stopPropagation();
                      }}
                    >
                      <div className='cursor-pointer'>
                        <div className='aspect-square bg-neutral-200 dark:bg-neutral-950 flex justify-center items-center overflow-hidden'>
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
                  </FolderContextMenu>
                ))}
                {/* Files */}
                {explorerData.files.map((file, index) => (
                  <FileContextMenu
                    key={file.id}
                    file={{
                      id: file.id,
                      name: file.name,
                      download_url: file.download_url,
                      mime_type: file.mime_type,
                      parent: currentPath || null,
                    }}
                  >
                    <div
                      ref={(el) => {
                        itemRefs.current[file.id] = el;
                      }}
                      className={`group relative bg-neutral-50 dark:bg-neutral-900 rounded-lg transition-all duration-200 overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:shadow-md ${selectedIds.has(file.id) ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-950' : ''}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey) {
                          setSelectedIds((prev) => {
                            const newSet = new Set(prev);
                            if (newSet.has(file.id)) {
                              newSet.delete(file.id);
                            } else {
                              newSet.add(file.id);
                            }
                            return newSet;
                          });
                        } else {
                          setSelectedIds(new Set([file.id]));
                          openFilePreview(file, index);
                        }
                        e.stopPropagation();
                      }}
                    >
                      <div className='cursor-pointer'>
                        <div className='aspect-square bg-neutral-200 dark:bg-neutral-950 flex justify-center items-center overflow-hidden'>
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
                  </FileContextMenu>
                ))}
              </div>
            </div>
          </EmptySpaceContextMenu>
        )}
      </div>

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

      {/* Tag Modal Component */}
      <CloudTagModal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        selectedItemsCount={selectedIds.size}
        onTagApply={handleApplyTags}
      />
    </div>
  );
};

export default CloudExplorer;
