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
