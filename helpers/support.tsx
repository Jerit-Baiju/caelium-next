export const truncate = ({ chars, length }: { chars: string | null; length: number }) => {
  return chars ? `${chars?.substring(0, length)}...` : '';
};

export const getTime = (timestamp: string | null) => {
  const date = new Date(timestamp ? timestamp : '');
  const formatted = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return timestamp ? formatted : '';
};

export const formatDate = (dateString: Date | null | undefined) => {
  const date = new Date(dateString ? dateString : '');
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};
