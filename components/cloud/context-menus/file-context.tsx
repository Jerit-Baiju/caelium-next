import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { FiCopy, FiDownload, FiEdit2, FiInfo, FiMove, FiShare2, FiTrash2 } from 'react-icons/fi';

interface FileContextMenuProps {
  children: React.ReactNode;
  file: {
    id: string;
    name: string;
    download_url?: string;
    mime_type?: string;
    parent?: string | null;
  };
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  children,
  file,
}) => {
  const { toast } = useToast();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(file.name);

  // File operations
  const handleDownload = () => {
    if (file.download_url) {
      console.log('Downloading file', file.name, file.download_url);
      // Simple notification instead of actual download
      toast({
        title: "Download initiated",
        description: `Downloading ${file.name}`,
      });
    } else {
      toast({
        title: "Download failed",
        description: "Download URL not available",
        variant: "destructive",
      });
    }
  };

  const handleRename = async () => {
    if (!newFileName.trim() || newFileName === file.name) {
      setIsRenameDialogOpen(false);
      return;
    }

    try {
      console.log('Renaming file', file.id, 'to', newFileName);
      // Simulate API call success
      toast({
        title: "File renamed",
        description: `Successfully renamed to "${newFileName}"`,
      });
      // Simulate refresh
      console.log('Refreshing directory contents');
    } catch (error) {
      console.error('Error renaming file:', error);
      toast({
        title: "Rename failed",
        description: "An error occurred while renaming the file",
        variant: "destructive",
      });
    } finally {
      setIsRenameDialogOpen(false);
    }
  };

  const handleShare = async () => {
    try {
      console.log('Sharing file', file.id);
      // Simulate API call success
      // Mock share URL
      const mockShareUrl = `https://example.com/shared/${file.id}`;
      console.log('Share URL:', mockShareUrl);
      
      // Simulate copying to clipboard
      toast({
        title: "Link copied to clipboard",
        description: "Anyone with this link can access the file",
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      toast({
        title: "Share failed",
        description: "Could not create sharing link",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return;
    }

    try {
      console.log('Deleting file', file.id);
      // Simulate API call success
      toast({
        title: "File deleted",
        description: `"${file.name}" has been deleted`,
      });
      // Simulate refresh
      console.log('Refreshing directory contents');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting the file",
        variant: "destructive",
      });
    }
  };

  const handleMove = () => {
    console.log('Move file', file.id);
    toast({
      title: "Move feature",
      description: "This feature will be implemented soon",
    });
  };

  const handleCopy = () => {
    console.log('Copy file', file.id);
    toast({
      title: "Copy feature",
      description: "This feature will be implemented soon",
    });
  };

  const handleViewDetails = () => {
    toast({
      title: file.name,
      description: `Type: ${file.mime_type || 'Unknown'} • ID: ${file.id}`,
    });
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            onClick={handleDownload}
            className="flex items-center cursor-pointer"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            <span>Download</span>
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuItem
            onClick={() => setIsRenameDialogOpen(true)}
            className="flex items-center cursor-pointer"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            <span>Rename</span>
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuItem
            onClick={handleShare}
            className="flex items-center cursor-pointer"
          >
            <FiShare2 className="mr-2 h-4 w-4" />
            <span>Share</span>
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem
            onClick={handleMove}
            className="flex items-center cursor-pointer"
          >
            <FiMove className="mr-2 h-4 w-4" />
            <span>Move</span>
          </ContextMenuItem>
          
          <ContextMenuItem
            onClick={handleCopy}
            className="flex items-center cursor-pointer"
          >
            <FiCopy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuItem
            onClick={handleViewDetails}
            className="flex items-center cursor-pointer"
          >
            <FiInfo className="mr-2 h-4 w-4" />
            <span>Details</span>
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem
            onClick={handleDelete}
            className="flex items-center cursor-pointer text-red-600 dark:text-red-400"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
            <DialogDescription>Enter a new name for this file</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <input
              type='text'
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder='File name'
              className='w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileContextMenu;
