import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiLoader, FiSearch } from 'react-icons/fi';
import { IoWarningOutline } from 'react-icons/io5';

interface CloudTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFileIds: string[];
  selectedItemsCount: number;
  onTagApply: (tags: string[]) => void; // We'll keep this interface the same for future implementation
}

interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'pink';
  owner?: string;
}

const CloudTagModal: React.FC<CloudTagModalProps> = ({ isOpen, onClose, selectedFileIds, selectedItemsCount, onTagApply }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const { toast } = useToast();
  const api = useAxios();

  // Reset selections when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Reset selection when opening the modal
      setSelectedTags([]);
      setSearchQuery('');
      fetchTags();
    }
  }, [isOpen]);

  // Fetch tags from the backend
  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/cloud/tags/');
      setAllTags(
        response.data.map((tag: any) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color || getRandomColor(),
          owner: tag.owner,
        })),
      );
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tags. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get random color for tags
  const getRandomColor = (): Tag['color'] => {
    const colors: Tag['color'][] = ['blue', 'green', 'amber', 'red', 'purple', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Filter tags based on search query
  const filteredTags = searchQuery ? allTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) : allTags;

  // Check if search query exactly matches any existing tag name (case-insensitive)
  const tagExists = searchQuery ? allTags.some((tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()) : false;
  
  // Generate a dummy tag for visual preview when typing a new tag name
  const dummyTag: Tag | null = searchQuery && !tagExists ? {
    id: 'dummy-tag',
    name: searchQuery,
    color: getRandomColor(),
  } : null;

  // Create new tag
  const handleCreateTag = async () => {
    if (!searchQuery.trim()) return;

    // Check if tag already exists
    const tagExists = allTags.some((tag) => tag.name.toLowerCase() === searchQuery.toLowerCase());
    if (tagExists) {
      toast({
        title: 'Tag already exists',
        description: 'A tag with this name already exists.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingTag(true);

    try {
      // Create the tag and associate it with the selected files
      const response = await api.post('/api/cloud/tags/', {
        name: searchQuery.trim(),
        file_ids: selectedFileIds,
      });

      const newTag: Tag = {
        id: response.data.id,
        name: response.data.name,
        color: getRandomColor(), // Backend doesn't have color yet, so we assign randomly
        owner: response.data.owner,
      };

      setAllTags([...allTags, newTag]);
      setSelectedTags([...selectedTags, newTag.id]);
      setSearchQuery('');

      toast({
        title: 'Tag created',
        description: `Tag "${newTag.name}" created successfully.`,
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tag. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTag(false);
    }
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

  // Apply tags to files
  const handleApply = async () => {
    if (selectedTags.length === 0) {
      onClose();
      return;
    }

    try {
      // For each selected tag, associate it with all selected files
      const promises = selectedTags.map((tagId) =>
        api.post(`/api/cloud/tags/${tagId}/tag_files/`, {
          file_ids: selectedFileIds,
        }),
      );

      await Promise.all(promises);

      toast({
        title: 'Tags applied',
        description: `Successfully applied tags to ${selectedItemsCount} files.`,
      });

      onTagApply(selectedTags);
      onClose();
    } catch (error) {
      console.error('Error applying tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply tags to some files. Please try again.',
        variant: 'destructive',
      });
    }
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
            <div className='mt-2 flex justify-items-center text-sm text-muted-foreground'>
              <IoWarningOutline className='mr-1' size={16} />
              <span>Pressing Enter will create a new tag named </span>
              <span className='font-medium text-foreground mx-1'>{searchQuery}</span>
            </div>
          )}
        </div>

        <div className='mt-4'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <FiLoader className='animate-spin text-primary' size={24} />
            </div>
          ) : (selectedTags.length > 0 || filteredTags.length > 0 || (searchQuery && !tagExists)) ? (
            <div className='flex flex-wrap gap-2'>
              {(() => {
                // Get all selected tags regardless of search query
                const selectedTagObjects = selectedTags
                  .map((tagId) => allTags.find((tag) => tag.id === tagId))
                  .filter(Boolean);

                // Then get all the unselected tags that match the filter criteria
                const unselectedFilteredTags = filteredTags.filter((tag) => !selectedTags.includes(tag.id));

                // Always include selected tags first, then filtered unselected tags
                const orderedTags = [...selectedTagObjects, ...unselectedFilteredTags];

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
                    
                    {/* Show the dummy tag when typing a new tag name */}
                    {dummyTag && (
                      <motion.div
                        key={dummyTag.id}
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
                        onClick={handleCreateTag}
                      >
                        <Badge
                          variant='default'
                          className='px-3 py-1 bg-secondary/30 text-secondary-foreground border-1 border-dashed border-white shadow-md'
                        >
                          {dummyTag.name}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })()}
            </div>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>{searchQuery ? '' : 'No tags yet. Create your first tag!'}</div>
          )}
        </div>

        <DialogFooter className='sm:justify-between mt-6'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Tags</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloudTagModal;
