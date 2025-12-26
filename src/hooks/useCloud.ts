import useAxios from '@/hooks/useAxios';

const useCloud = () => {
  const api = useAxios();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fetchExplorerData = async (currentPath: string) => {
    try {
      const response = await api.get(`/api/cloud/explorer${currentPath ? `?parent=${currentPath}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching explorer data:', error);
      throw error;
    }
  };

  const fetchImageUrls = async (files: { id: string; download_url: string; mime_type: string; name: string }[], onImageLoaded?: (fileId: string, url: string) => void) => {
    const imageFiles = files.filter((file) => file.mime_type.startsWith('image/'));
    if (imageFiles.length === 0) return {};

    const batchSize = 8;
    const urls: Record<string, string> = {};

    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);

      // Process each image in the batch individually
      batch.forEach(async (file) => {
        try {
          const response = await api.get(file.download_url, { responseType: 'blob' });
          const objectUrl = URL.createObjectURL(response.data);

          // Update the URLs object
          urls[file.id] = objectUrl;

          // Call the callback immediately when an individual image is loaded
          if (onImageLoaded) {
            onImageLoaded(file.id, objectUrl);
          }
        } catch (error) {
          console.error(`Error fetching image ${file.name}:`, error);
        }
      });
    }

    return urls;
  };

  const uploadFiles = async (files: File[], currentPath: string, onProgress?: (progress: Record<string, number>) => void) => {
    if (files.length === 0) return false;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (currentPath) formData.append('parent_directory', currentPath);
    formData.append('auto_organize', 'false');

    try {
      const newProgress: Record<string, number> = {};
      files.forEach((file) => (newProgress[file.name] = 0));
      if (onProgress) onProgress(newProgress);

      await api.post('/api/cloud/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const updatedProgress: Record<string, number> = {};
            files.forEach((file) => (updatedProgress[file.name] = percentCompleted));
            onProgress(updatedProgress);
          }
        },
      });

      const completedProgress: Record<string, number> = {};
      files.forEach((file) => (completedProgress[file.name] = 100));
      if (onProgress) onProgress(completedProgress);

      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      const failedProgress: Record<string, number> = {};
      files.forEach((file) => (failedProgress[file.name] = -1));
      if (onProgress) onProgress(failedProgress);
      return false;
    }
  };

  const getFileThumbnailType = (file: { mime_type: string; name: string }) => {
    if (file.mime_type.startsWith('image/')) return 'image';
    if (file.mime_type.startsWith('video/')) return 'video';
    if (file.mime_type.startsWith('audio/')) return 'audio';
    if (file.mime_type.includes('pdf')) return 'pdf';
    if (file.mime_type.includes('zip') || file.mime_type.includes('archive')) return 'archive';
    if (file.mime_type.includes('code') || file.name.match(/\.(js|ts|html|css|py|java|cpp|php|json)$/)) return 'code';
    return 'file';
  };

  const createFolder = async (name: string, parentId: string | null = null) => {
    try {
      const payload: { name: string; parent?: string } = { name };
      if (parentId) {
        payload.parent = parentId;
      }

      const response = await api.post('/api/cloud/directory/create/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  const renameDirectory = async (id: string, name: string) => {
    try {
      const response = await api.post(`/api/cloud/directory/${id}/rename/`, { name });
      return response.data;
    } catch (error) {
      console.error('Error renaming directory:', error);
      throw error;
    }
  };

  const renameFile = async (id: string, name: string) => {
    try {
      const response = await api.post(`/api/cloud/files/${id}/rename/`, { name });
      return response.data;
    } catch (error) {
      console.error('Error renaming file:', error);
      throw error;
    }
  };

  const moveDirectory = async (id: string, parentId: string | null) => {
    try {
      const response = await api.post(`/api/cloud/directory/${id}/move/`, { parent: parentId });
      return response.data;
    } catch (error) {
      console.error('Error moving directory:', error);
      throw error;
    }
  };

  const moveFile = async (id: string, parentId: string | null) => {
    try {
      const response = await api.post(`/api/cloud/files/${id}/move/`, { parent: parentId });
      return response.data;
    } catch (error) {
      console.error('Error moving file:', error);
      throw error;
    }
  };



  return {
    formatFileSize,
    fetchExplorerData,
    fetchImageUrls,
    uploadFiles,
    getFileThumbnailType,
    createFolder,
    renameDirectory,
    renameFile,
    moveDirectory,
    moveFile,
  };
};

export default useCloud;
