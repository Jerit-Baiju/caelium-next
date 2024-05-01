export const truncate = ({ chars, length }: { chars: string | null; length: number }) => {
  return chars ? `${chars?.substring(0, length)}` : '';
};

export const getTime = (timestamp: string | null | undefined | Date): string => {
  if (!timestamp) return '';
  const lastChatDate = new Date(timestamp);

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

  return getLastChatTime(lastChatDate);
};
