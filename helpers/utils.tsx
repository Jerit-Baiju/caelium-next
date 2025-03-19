import { User } from './props';

export const truncate = ({ chars, length }: { chars: string | null; length: number }) => {
  return chars ? `${chars?.substring(0, length)}` : '';
};

export const getTime = (timestamp: string | null | undefined | Date): string => {
  if (!timestamp) return '';
  const givenDate = new Date(timestamp);

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getLastChatTime = (lastChatDate: Date): string => {
    const currentDate = new Date();
    const lastChatDay = lastChatDate.getDate();
    const currentDay = currentDate.getDate();
    if (currentDay === lastChatDay) {
      return formatTime(lastChatDate);
    } else if (currentDay - lastChatDay === 1) {
      return 'Yesterday';
    } else {
      return formatDate(lastChatDate);
    }
  };

  return getLastChatTime(givenDate);
};

export const getDate = (dateStr: string): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [day, month, year] = dateStr.split('/').map(Number);
  const monthName = months[month - 1];

  return `${monthName} ${day}, ${year}`;
};

export const getURL = (url: string) => {
  return process.env.NEXT_PUBLIC_API_HOST + url;
};
export const formatTimeSince = (date: string | Date | undefined): string => {
  if (!date) return '';

  const now = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return pastDate.toLocaleDateString();
};

export const isSpecialUser = (user: User | null): boolean => {
  // Check localStorage first for cached value
  const cachedValue = typeof window !== 'undefined' ? localStorage.getItem(`special_user_${user?.id}`) : null;

  // If we have a cached value, use it
  if (cachedValue !== null) {
    return cachedValue === 'true';
  }

  // Otherwise check the property from the API response
  const isSpecial = user?.is_special_user === true;

  // Cache the result in localStorage
  if (typeof window !== 'undefined' && user?.id) {
    localStorage.setItem(`special_user_${user.id}`, isSpecial ? 'true' : 'false');
  }

  return isSpecial;
};
