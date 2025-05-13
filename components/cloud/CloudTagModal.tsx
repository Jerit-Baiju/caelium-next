import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

// Static tag data for now
const STATIC_TAGS: Tag[] = [
  { id: '1', name: 'Important', color: 'blue' },
  { id: '2', name: 'Work', color: 'green' },
  { id: '3', name: 'Personal', color: 'amber' },
  { id: '4', name: 'Archived', color: 'purple' },
  { id: '5', name: 'Shared', color: 'pink' },
  { id: '6', name: 'Project A', color: 'blue' },
  { id: '7', name: 'Project B', color: 'green' },
  { id: '8', name: 'Reference', color: 'red' },
];

interface CloudTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemsCount: number;
  onTagApply: (tags: string[]) => void; // We'll keep this interface the same for future implementation
}

interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'pink';
}

const CloudTagModal: React.FC<CloudTagModalProps> = ({ isOpen, onClose, selectedItemsCount, onTagApply }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>(STATIC_TAGS);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Reset selections when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Reset selection when opening the modal
      setSelectedTags([]);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter tags based on search query
  const filteredTags = searchQuery ? allTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) : allTags;

  // Create new tag
  const handleCreateTag = () => {
    if (!searchQuery.trim()) return;

    // Check if tag already exists
    const tagExists = allTags.some((tag) => tag.name.toLowerCase() === searchQuery.toLowerCase());

    if (tagExists) return;

    // Random color selection
    const colors: Tag['color'][] = ['blue', 'green', 'amber', 'red', 'purple', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTag: Tag = {
      id: `new-${Date.now()}`,
      name: searchQuery.trim(),
      color: randomColor,
    };

    setAllTags([...allTags, newTag]);
    setSelectedTags([...selectedTags, newTag.id]);
    setSearchQuery('');
  };

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      // If tag is already selected, remove it
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      // Otherwise add it to the end of the array
      return [...prev, tagId];
    });
  };

  // Apply tags and close modal
  const handleApply = () => {
    onTagApply(selectedTags);
    onClose();
  };

  // Custom close handler that resets state
  const handleClose = () => {
    setSelectedTags([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md bg-neutral-950/80 border-border shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Add Tags</DialogTitle>
          <DialogDescription>
            {selectedItemsCount} {selectedItemsCount === 1 ? 'file' : 'files'} selected
          </DialogDescription>
        </DialogHeader>

        <div className='relative mt-2'>
          <FiSearch className='absolute left-3 top-3 text-muted-foreground' />
          <Input
            placeholder='Search or create a tag...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-background border-border'
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateTag();
            }}
          />
          {searchQuery && !filteredTags.some((t) => t.name.toLowerCase() === searchQuery.toLowerCase()) && (
            <div className='mt-2 flex items-center text-sm text-muted-foreground'>
              <FiPlus className='mr-1' size={16} />
              <span>Create "</span>
              <span className='font-medium text-foreground'>{searchQuery}</span>
              <span>"</span>
              <Button variant='ghost' size='sm' className='ml-auto' onClick={handleCreateTag}>
                Create
              </Button>
            </div>
          )}
        </div>

        <div className='mt-4'>
          {filteredTags.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {/* Create a new sorted tags array with selected tags at the beginning */}
              {(() => {
                // First get all the selected tags that match the filter criteria
                const selectedFilteredTags = selectedTags
                  .map((tagId) => allTags.find((tag) => tag.id === tagId))
                  .filter(Boolean)
                  .filter((tag) => !searchQuery || tag!.name.toLowerCase().includes(searchQuery.toLowerCase()));

                // Then get all the unselected tags that match the filter criteria
                const unselectedFilteredTags = filteredTags.filter((tag) => !selectedTags.includes(tag.id));

                // Combine them
                const orderedTags = [...selectedFilteredTags, ...unselectedFilteredTags];

                // Render the combined list with AnimatePresence
                return (
                  <AnimatePresence>
                    {orderedTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag!.id);
                      return (
                        <motion.div
                          key={tag!.id}
                          onClick={() => toggleTag(tag!.id)}
                          className='cursor-pointer'
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            duration: 0.2,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={isSelected ? 'default' : 'outline'}
                            className={`px-3 py-1 transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background text-foreground/70 hover:text-foreground/90'
                            }`}
                          >
                            {tag!.name}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                );
              })()}
            </div>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>No tags found</div>
          )}
        </div>

        <DialogFooter className='sm:justify-between mt-6'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={selectedTags.length === 0}>
            Apply Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloudTagModal;
