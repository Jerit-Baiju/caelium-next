export interface UserProps {
  id: number;
  username: string;
  name: string;
  avatar: string;
}
export interface Chats {
  id: number;
  chat: Chat;
  name: null;
  participants: number[];
}

export interface Chat {
  id: number;
  avatar: string;
  name: string;
}
