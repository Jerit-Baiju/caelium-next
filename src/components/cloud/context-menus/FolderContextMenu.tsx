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

import React, { useState } from 'react';
import { FiCopy, FiEdit2, FiFolderPlus, FiInfo, FiMove, FiShare2, FiTrash2 } from 'react-icons/fi';

interface FolderContextMenuProps {
  children: React.ReactNode;
  folder: {
    id: string;
    name: string;
    parent?: string | null;
  };
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onMove?: (id: string) => void;
  onCopy?: (id: string) => void;
  onCreateSubfolder?: (parentId: string, name: string) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  children,
  folder,
  onRename,
  onDelete,
  onShare,
  onMove,
  onCopy,
  onCreateSubfolder,
}) => {

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const [newSubfolderName, setNewSubfolderName] = useState('');

  const handleRename = () => {
    if (!newFolderName.trim() || newFolderName === folder.name) {
      setIsRenameDialogOpen(false);
      return;
    }
    onRename?.(folder.id, newFolderName);
    console.log({
      title: 'Folder renamed',
      description: `Renamed to "${newFolderName}"`,
    });
    setIsRenameDialogOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
      onDelete?.(folder.id);
      console.log({
        title: 'Folder deleted',
        description: `"${folder.name}" has been deleted`,
      });
    }
  };

  const handleShare = () => {
    onShare?.(folder.id);
    console.log({
      title: 'Share link copied',
      description: 'Anyone with this link can access the folder',
    });
  };

  const handleMove = () => {
    onMove?.(folder.id);
    console.log({
      title: 'Move feature',
      description: 'This feature will be implemented soon',
    });
  };

  const handleCopy = () => {
    onCopy?.(folder.id);
    console.log({
      title: 'Copy feature',
      description: 'This feature will be implemented soon',
    });
  };

  const handleViewDetails = () => {
    console.log({
      title: folder.name,
      description: `ID: ${folder.id}`,
    });
  };

  const handleCreateSubfolder = () => {
    if (!newSubfolderName.trim()) {
      setIsCreateDialogOpen(false);
      return;
    }
    onCreateSubfolder?.(folder.id, newSubfolderName);
    console.log({
      title: 'Subfolder created',
      description: `Created subfolder "${newSubfolderName}"`,
    });
    setIsCreateDialogOpen(false);
    setNewSubfolderName('');
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
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
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center cursor-pointer"
          >
            <FiFolderPlus className="mr-2 h-4 w-4" />
            <span>Create Subfolder</span>
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
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
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>Enter a new name for this folder</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Subfolder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create subfolder</DialogTitle>
            <DialogDescription>Enter a name for your new subfolder</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newSubfolderName}
              onChange={(e) => setNewSubfolderName(e.target.value)}
              placeholder="Subfolder name"
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubfolder();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubfolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FolderContextMenu;
