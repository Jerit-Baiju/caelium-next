export interface GetUrlProps {
  url: string;
  method?: string;
}

export const getUrl = ({ url, method = 'GET' }: GetUrlProps) => {
  return { method: method, url: `${process.env.NEXT_PUBLIC_API_HOST}${url}` };
};
