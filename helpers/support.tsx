export interface GetUrlProps {
  url: string;
  method?: string;
  data?: any;
  headers?: any;
  token?: string;
}

export const getUrl = ({ url, method = 'GET', data, token }: GetUrlProps) => {
  return {
    method: method,
    url: `${process.env.NEXT_PUBLIC_API_HOST}${url}`,
    data: data,
    headers: {
      Authorization: 'Bearer ' + token,
      'content-type': 'application/json',
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
