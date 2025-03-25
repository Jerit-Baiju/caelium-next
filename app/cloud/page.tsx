'use client';
import FileContextMenu from '@/components/cloud/context-menus/file-context';
import FilePreview from '@/components/cloud/preview';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatBytes, formatTimeSince } from '@/helpers/utils';
import useCloud from '@/hooks/useCloud';
import Link from 'next/link';
import { useState } from 'react';
import { FiChevronRight, FiDownload, FiFolder, FiFolderPlus, FiHome, FiPlus, FiUpload } from 'react-icons/fi';

const CloudExplorer = () => {
  // Use the useCloud hook to handle all cloud functionality
  const {
    loading,
    directories,
    files,
    currentDirId,
    breadcrumbs,
    thumbnailUrls,
    selectedFile,
    isPreviewOpen,
    selectedFileIndex,
    isDragging,
    draggingOverDirId,
    isUploading,
    uploadProgress,

    fetchDirectoryContents,
    navigateToDirectory,
    downloadFile,

    openFilePreview,
    closeFilePreview,
    nextFilePreview,
    previousFilePreview,

    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    getFileIcon,
    getColorClass,
    getBgColorClass,
  } = useCloud();

  // State for new folder dialog
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Create a new folder
  const handleCreateNewFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/cloud/directories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('authTokens') || '{}').access}`,
        },
        body: JSON.stringify({
          name: newFolderName,
          parent: currentDirId,
        }),
      });

      if (response.ok) {
        // Refresh directory contents
        fetchDirectoryContents();
        // Close dialog and reset form
        setIsNewFolderDialogOpen(false);
        setNewFolderName('');
      } else {
        throw new Error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // Handle file download wrapper
  const handleFileDownload = (downloadUrl: string, fileName: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    downloadFile(downloadUrl, fileName);
  };

  // Render thumbnail or icon
  const renderThumbnailOrIcon = (file: any) => {
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
  const renderGridItem = (item: any, isDirectory = false, index = 0) => {
    const isDragTarget = isDirectory && draggingOverDirId === item.id;

    const gridItem = (
      <div
        key={item.id}
        className={`group relative rounded-lg overflow-hidden border transition-all cursor-pointer shadow-sm hover:shadow-md ${
          isDragTarget
            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
        }`}
        onClick={() => (isDirectory ? navigateToDirectory(item.id) : openFilePreview(item, index))}
        onDragEnter={(e) => isDirectory && handleDragEnter(e, item.id)}
        onDragLeave={(e) => isDirectory && handleDragLeave(e)}
        onDragOver={(e) => isDirectory && handleDragOver(e, item.id)}
        onDrop={(e) => isDirectory && handleDrop(e, item.id)}
      >
        <div className='flex flex-col'>
          {/* Thumbnail/Icon container */}
          <div className={`aspect-square ${getBgColorClass(item)}`}>
            {isDirectory ? (
              <div className='w-full h-full flex items-center justify-center text-amber-500'>
                <FiFolder className='w-12 h-12' />
              </div>
            ) : (
              renderThumbnailOrIcon(item)
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
                handleFileDownload(item.download_url, item.name, e);
              }}
            >
              <FiDownload className='w-4 h-4 text-neutral-700 dark:text-neutral-300' />
            </button>
          )}
        </div>
      </div>
    );

    // Wrap with context menu only for files, not directories
    return isDirectory ? (
      gridItem
    ) : (
      <FileContextMenu key={item.id} file={item}>
        {gridItem}
      </FileContextMenu>
    );
  };

  // Format FileData to match what FilePreview component expects
  const formatFileForPreview = (file: any) => {
    if (!file) return null;

    return {
      id: file.id,
      name: file.name,
      size: formatBytes(file.size),
      time: formatTimeSince(file.created_at),
      download_url: file.download_url,
      mime_type: file.mime_type,
    };
  };

  return (
    <div
      className='flex grow flex-col'
      onDragEnter={handleDragEnter}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
    >
      {/* Main content container */}
      <div
        className={`flex flex-col grow py-6 mx-auto space-y-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${
          isDragging ? 'bg-blue-50/50 dark:bg-blue-900/20 rounded-xl transition-colors' : ''
        }`}
      >
        {/* Header section */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold dark:text-neutral-100'>My Files</h1>
            <p className='text-neutral-600 dark:text-neutral-400'>Access and manage your secure cloud storage</p>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Upload button */}
            <Link
              href='/cloud/upload'
              className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-5 py-2.5 rounded-md transition shadow-sm'
            >
              <FiUpload className='mr-2 w-4 h-4' />
              <span>Upload</span>
            </Link>

            {/* New folder button */}
            <button
              className='flex items-center bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 px-3 py-2 rounded-md transition shadow-sm'
              onClick={() => setIsNewFolderDialogOpen(true)}
            >
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
        <div className='rounded-xl shadow-sm flex-grow'>
          {loading ? (
            <div className='w-full'>
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
            </div>
          ) : (
            <div>
              {directories.length === 0 && files.length === 0 ? (
                <div
                  className={`text-center py-16 ${isDragging ? 'bg-blue-100/50 dark:bg-blue-900/20 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700' : ''}`}
                >
                  <div className='text-neutral-400 dark:text-neutral-500 mb-4'>
                    <FiFolder className='w-16 h-16 mx-auto' />
                  </div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2'>
                    {isDragging ? 'Drop files here to upload' : 'This folder is empty'}
                  </h3>
                  <p className='text-neutral-600 dark:text-neutral-400 mb-6'>
                    {isDragging
                      ? 'Files will be uploaded to the current directory'
                      : 'Upload files or create a new folder to get started'}
                  </p>
                  {!isDragging && (
                    <div className='flex justify-center space-x-4'>
                      <Link
                        href='/cloud/upload'
                        className='flex items-center bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-4 py-2 rounded-md transition shadow-sm'
                      >
                        <FiUpload className='mr-2 w-4 h-4' />
                        <span>Upload Files</span>
                      </Link>
                      <button
                        className='flex items-center bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 px-4 py-2 rounded-md transition shadow-sm'
                        onClick={() => setIsNewFolderDialogOpen(true)}
                      >
                        <FiFolderPlus className='mr-2 w-4 h-4' />
                        <span>New Folder</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {/* Directories first */}
                    {directories.map((dir, index) => renderGridItem(dir, true, index))}

                    {/* Then files */}
                    {files.map((file, index) => renderGridItem(file, false, directories.length + index))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drag overlay when dragging files */}
      {isDragging && !draggingOverDirId && (
        <div className='fixed inset-0 bg-blue-500/10 dark:bg-blue-700/20 pointer-events-none z-10 flex items-center justify-center'>
          <div className='bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg'>
            <p className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>Drop files to upload to this folder</p>
          </div>
        </div>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <div className='fixed bottom-5 right-5 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-w-md'>
          <h3 className='font-medium text-neutral-800 dark:text-neutral-200 mb-2'>Uploading files...</h3>
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

      {/* New folder dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <input
              type='text'
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder='Folder name'
              className='w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNewFolder();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <FilePreview
        isOpen={isPreviewOpen}
        onClose={closeFilePreview}
        file={formatFileForPreview(selectedFile)}
        onDownload={handleFileDownload}
        onNext={nextFilePreview}
        onPrevious={previousFilePreview}
        hasNext={
          selectedFileIndex < files.filter((f) => f.mime_type?.startsWith('image/') || f.mime_type?.startsWith('video/')).length - 1
        }
        hasPrevious={selectedFileIndex > 0}
      />
    </div>
  );
};

export default CloudExplorer;
