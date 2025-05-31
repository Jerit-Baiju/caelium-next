// Dummy data for user posts
export const dummyPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: "Just finished working on my new project! Can't wait to share it with everyone.",
    likes: 24,
    comments: 5,
    createdAt: '2025-05-28T14:30:00Z'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Beautiful day for hiking! #nature #outdoors',
    likes: 56,
    comments: 8,
    createdAt: '2025-05-25T09:45:00Z'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Working from my favorite cafe today. The coffee is amazing!',
    likes: 42,
    comments: 13,
    createdAt: '2025-05-22T16:20:00Z'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Sunset views are always worth the climb.',
    likes: 89,
    comments: 7,
    createdAt: '2025-05-20T19:30:00Z'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Tech conference was amazing! Met so many brilliant minds.',
    likes: 35,
    comments: 4,
    createdAt: '2025-05-15T11:00:00Z'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Morning routine - coffee and coding.',
    likes: 67,
    comments: 9,
    createdAt: '2025-05-10T08:15:00Z'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Weekend vibes!',
    likes: 112,
    comments: 18,
    createdAt: '2025-05-08T12:45:00Z'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'My new workspace setup.',
    likes: 78,
    comments: 23,
    createdAt: '2025-05-05T15:30:00Z'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Dinner with friends at this amazing new restaurant.',
    likes: 45,
    comments: 6,
    createdAt: '2025-05-03T20:15:00Z'
  }
];

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return Math.floor(secondsAgo / 60) + 'm';
  if (secondsAgo < 86400) return Math.floor(secondsAgo / 3600) + 'h';
  if (secondsAgo < 2592000) return Math.floor(secondsAgo / 86400) + 'd';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
