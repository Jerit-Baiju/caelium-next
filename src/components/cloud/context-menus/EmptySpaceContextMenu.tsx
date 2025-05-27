import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import React, { useState } from 'react';
import { FiFolderPlus, FiShare2 } from 'react-icons/fi';

interface EmptySpaceContextMenuProps {
  children: React.ReactNode;
  currentFolderId: string | null;
  onCreateFolder: (name: string) => void;
  onShareFolder: () => void;
}

const EmptySpaceContextMenu: React.FC<EmptySpaceContextMenuProps> = ({
  children,
  currentFolderId,
  onCreateFolder,
  onShareFolder,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      setIsCreateDialogOpen(false);
      return;
    }
    onCreateFolder(newFolderName);
    console.log({
      title: 'Folder created',
      description: `Created folder "${newFolderName}"`,
    });
    setIsCreateDialogOpen(false);
    setNewFolderName('');
  };

  const handleShare = () => {
    onShareFolder();
    console.log({
      title: 'Share link copied',
      description: 'Anyone with this link can access the folder',
    });
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center cursor-pointer"
          >
            <FiFolderPlus className="mr-2 h-4 w-4" />
            <span>Create Folder</span>
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleShare}
            className="flex items-center cursor-pointer"
          >
            <FiShare2 className="mr-2 h-4 w-4" />
            <span>Share this Folder</span>
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmptySpaceContextMenu;
