export interface GetUrlProps {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  token?: string;
  content_type?: 'application/json' | 'multipart/form-data';
}

export const getUrl = ({ url, method = 'GET', data, token, content_type = 'application/json' }: GetUrlProps) => {
  return {
    url: `${process.env.NEXT_PUBLIC_API_HOST}${url}`,
    data: data,
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
      'content-type': content_type,
    },
  };
};

export const getMedia = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_HOST + '/' + path}`;
};

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
