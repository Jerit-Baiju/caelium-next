export const truncate = ({ chars, length }: { chars: string | null; length: number }) => {
  return chars ? `${chars?.substring(0, length)}...` : '';
};

export const getTime = (timestamp: string | null | undefined | Date): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();
  if (timeDiff < 24 * 60 * 60 * 1000) {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
  if (timeDiff < 48 * 60 * 60 * 1000) {
    return 'Yesterday';
  }
  if (date.getDay() >= (currentDate.getDay() - 1 + 7) % 7) {
    return date.toLocaleString('en-US', { weekday: 'long' });
  }
  if (date.getFullYear() === currentDate.getFullYear()) {
    return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
  }
  return date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
