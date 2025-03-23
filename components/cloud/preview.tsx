'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FiDownload,
  FiMaximize,
  FiMinimize,
  FiPause,
  FiPlay,
  FiSlash,
  FiVolume,
  FiVolume2
} from 'react-icons/fi';

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    size: string;
    time: string;
    download_url: string;
    mime_type: string;
  } | null;
  onDownload?: (url: string, fileName: string) => void;
}

const FilePreview = ({ isOpen, onClose, file, onDownload }: PreviewProps) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Prevent default behaviors for these keys
      if (['Escape', 'f', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'Escape':
          if (fullscreen) {
            setFullscreen(false);
          } else {
            handleClose();
          }
          break;
        case 'f':
          toggleFullscreen();
          break;
        case ' ': // Space key
          if (file?.mime_type.startsWith('video/')) {
            togglePlay();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, fullscreen, file, isPlaying]);

  // Reset state when file changes
  useEffect(() => {
    if (file) {
      setLoading(true);
      setError(null);
      setPreviewUrl(null);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setIsPlaying(false);
      setCurrentTime(0);
      setFullscreen(false); // Reset fullscreen state for new files
      loadPreview();
    }
  }, [file]);

  // Load preview based on file type
  const loadPreview = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      
      // Get auth token from localStorage
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        setError('Authentication required');
        toast({
          title: 'Authentication Error',
          description: 'You need to be logged in to preview files',
          variant: 'destructive',
        });
        return;
      }
      
      const authTokens = JSON.parse(authTokensStr);
      const accessToken = authTokens.access;
      
      // Use fetch API to get the file with proper authorization
      const response = await fetch(file.download_url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.status} ${response.statusText}`);
      }
      
      // Get the file as a blob and create a URL
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // Reset states
      setError(null);

      // Auto play video if it's a video file
      if (file.mime_type.startsWith('video/')) {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Autoplay prevented by browser
              setIsPlaying(false);
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Preview error:', error);
      setError('Failed to load preview');
      toast({
        title: 'Preview Failed',
        description: 'There was an error loading the preview',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean up resources when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle dialog close and clean up
  const handleClose = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setPreviewUrl(null);
    setFullscreen(false); // Reset fullscreen state when closing
    onClose();
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle zoom in and out
  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel + 0.25, 3) 
      : Math.max(zoomLevel - 0.25, 0.5);
    setZoomLevel(newZoom);
  };

  // Reset zoom and position
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY
      });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Update current time while video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Set duration when video metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seeking in the video
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle download button click
  const handleDownload = () => {
    if (file && onDownload) {
      onDownload(file.download_url, file.name);
    }
  };

  // Check if file is a video
  const isVideo = file?.mime_type.startsWith('video/');

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: 0.2 }
    }
  };

  // Define dialog content based on fullscreen state
  const dialogContent = (
    <AnimatePresence mode="wait">
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
        className="flex flex-col items-center relative"
      >
        {/* Preview container */}
        <div 
          className={`relative w-full overflow-hidden ${fullscreen ? 'h-[90vh]' : 'max-h-[70vh]'} flex items-center justify-center bg-neutral-900`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
        >
          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-20">
              <div className="w-10 h-10 border-4 border-neutral-600 border-t-neutral-300 rounded-full animate-spin mb-3"></div>
              <p className="text-neutral-300">Loading preview...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-20">
              <FiSlash size={48} className="text-neutral-400 mb-3" />
              <p className="text-neutral-300">{error}</p>
            </div>
          )}

          {/* Image preview */}
          {!isVideo && previewUrl && !loading && (
            <motion.img
              src={previewUrl}
              alt={file?.name || 'Preview'}
              className="max-w-full max-h-full object-contain select-none"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              draggable={false}
            />
          )}

          {/* Video preview */}
          {isVideo && previewUrl && !loading && (
            <motion.video
              ref={videoRef}
              src={previewUrl}
              className="max-w-full max-h-full object-contain select-none"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              controls={false}
              onClick={togglePlay}
              draggable={false}
            />
          )}
        </div>

        {/* Controls */}
        <motion.div 
          className="w-full px-4 py-3 flex flex-col space-y-2 bg-neutral-800"
          variants={controlsVariants}
          initial="hidden"
          animate="visible"
        >
          {/* File info */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium truncate max-w-md">{file?.name}</h3>
              <p className="text-xs text-neutral-400">{file?.size} • {file?.time}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white"
                title={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
              >
                {fullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white"
                title="Download"
              >
                <FiDownload size={18} />
              </button>
            </div>
          </div>

          {/* Video controls */}
          {isVideo && previewUrl && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={togglePlay}
                  className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white"
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                >
                  {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
                </button>
                <div className="flex-grow">
                  <input 
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-white h-1.5 bg-neutral-600 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <button 
                  onClick={toggleMute}
                  className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FiVolume2 size={18} /> : <FiVolume size={18} />}
                </button>
                <div className="w-20 text-center text-sm text-neutral-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                <span className="mr-3">Keyboard shortcuts: <span className="px-1 bg-neutral-700 rounded">Space</span> Play/Pause</span>
                <span className="mr-3"><span className="px-1 bg-neutral-700 rounded">F</span> Fullscreen</span>
                <span><span className="px-1 bg-neutral-700 rounded">Esc</span> {fullscreen ? "Exit fullscreen" : "Close"}</span>
              </div>
            </div>
          )}

          {/* For non-video files, show shortcuts */}
          {(!isVideo || !previewUrl) && (
            <div className="text-xs text-neutral-400 mt-1">
              <span className="mr-3">Keyboard shortcuts: <span className="px-1 bg-neutral-700 rounded">F</span> Fullscreen</span>
              <span><span className="px-1 bg-neutral-700 rounded">Esc</span> {fullscreen ? "Exit fullscreen" : "Close"}</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent 
        className={`${fullscreen ? 'max-w-[95vw] max-h-[95vh] p-0' : 'max-w-4xl p-4'} bg-neutral-800 text-white border-neutral-700 overflow-hidden`}
      >
        <DialogTitle className="text-white pb-2">
          {file?.name || 'File Preview'}
          {fullscreen && (
            <button 
              onClick={toggleFullscreen}
              className="ml-2 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white inline-flex items-center justify-center"
              title="Exit fullscreen"
            >
              <FiMinimize size={14} />
            </button>
          )}
        </DialogTitle>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;