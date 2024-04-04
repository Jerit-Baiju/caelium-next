export interface Chat {
  id: number;
  other_participant: User;
  last_message_content: null;
  updated_time: null;
}

export interface User {
  id: number;
  username?: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: number;
  sender: User;
  chat?: Chat;
  timestamp: Date;
  content: string;
  side: string;
}
export interface Craft {
  id: number;
  title: string;
  tag: string;
  banner: string;
  content: string;
  date: Date;
  time: string;
  space: string;
  owner: User;
}

export interface BaseError {
  text: string;
  code: 'CHAT_NOT_FOUND' | 'FETCH_MESSAGES_FAILED';
};
