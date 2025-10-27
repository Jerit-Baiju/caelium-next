import { useEffect, useState } from 'react';

interface AuthMediaProps {
  src: string;
  type: 'image' | 'video' | 'audio';
  token?: string;
  alt?: string;
  className?: string;
}

const Media = ({ src, type, ...props }: AuthMediaProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMedia = async (url: string): Promise<string> => {
    // Get auth token from localStorage (same pattern as cloud page handleFileDownload)
    const authTokensStr = localStorage.getItem('authTokens');
    if (!authTokensStr) {
      throw new Error('Authentication required');
    }

    const authTokens = JSON.parse(authTokensStr);
    const accessToken = authTokens.access;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let currentUrl: string | null = null;

    async function fetchAndSet() {
      try {
        setLoading(true);
        setError(null);
        const url = await loadMedia(src);
        currentUrl = url;
        if (isMounted) {
          setBlobUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Media loading error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load media');
          setLoading(false);
        }
      }
    }

    fetchAndSet();

    return () => {
      isMounted = false;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [src]); // Removed authTokens dependency - now using localStorage directly

  if (loading) return <div className='bg-gray-100 w-full h-full animate-pulse' />;
  if (error) return <div className='bg-red-50 w-full h-full flex items-center justify-center text-red-500 text-sm p-4'>{error}</div>;
  if (!blobUrl) return <div className='bg-gray-100 w-full h-full' />;

  switch (type) {
    case 'video':
      return <video src={blobUrl} controls {...props} />;
    case 'audio':
      return <audio src={blobUrl} controls {...props} />;
    default:
      return <img src={blobUrl} {...props} />;
  }
};

export default Media;
