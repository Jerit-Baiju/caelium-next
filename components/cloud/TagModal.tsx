import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from 'react';
import { FiX } from 'react-icons/fi';

interface CloudTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagSearch: string;
  setTagSearch: (v: string) => void;
  filteredTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  onApply: () => void;
}

const CloudTagModal: React.FC<CloudTagModalProps> = ({
  isOpen,
  onClose,
  tagSearch,
  setTagSearch,
  filteredTags,
  selectedTags,
  setSelectedTags,
  onApply,
}) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none">
        <div className='bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md border border-neutral-200 dark:border-neutral-700 shadow-lg'>
          <DialogHeader>
            <div className='flex justify-between items-center mb-4'>
              <DialogTitle className="text-lg font-bold dark:text-white">Tag Selected</DialogTitle>
              <DialogClose asChild>
                <button onClick={onClose} className='p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                  <FiX size={20} />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>
          <input
            type='text'
            placeholder='Search tags...'
            value={tagSearch}
            onChange={e => setTagSearch(e.target.value)}
            className='w-full mb-4 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <div className='flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto'>
            {filteredTags.length === 0 ? (
              <span className='text-neutral-400 text-sm'>No tags found</span>
            ) : (
              filteredTags.map(tag => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full border text-sm transition-all duration-150 ${selectedTags.includes(tag) ? 'bg-blue-500 text-white border-blue-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'}`}
                  onClick={() => setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag])}
                >
                  {tag}
                </button>
              ))
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <button
                onClick={onClose}
                className='px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800'
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => { onApply(); onClose(); }}
              className='px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600'
            >
              Apply Tags
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CloudTagModal;
