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
