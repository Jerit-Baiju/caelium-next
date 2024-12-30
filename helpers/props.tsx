export interface Chat {
  id: number;
  name: string;
  group_icon: string | null;
  is_group: boolean;
  participants: User[];
  updated_time: Date;
  last_message_content: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: number;
  sender: User;
  chat?: Chat;
  size?: null | string;
  extension?: null | string;
  file_name: string | null;
  timestamp: Date;
  type: string;
  content: string;
  file: null;
}

export interface Craft {
  id: number;
  title: string;
  tag: string;
  banner: string;
  content: string;
  created_at: Date;
  time: string;
  space: string;
  owner: User;
}

export interface BaseError {
  text: string;
  code: 'CHAT_NOT_FOUND' | 'FETCH_FAILED';
}

export interface NavLink {
  name: string;
  url: string;
  active?: boolean;
}

export interface DropDown {
  name: string;
  options: NavLink[];
}

export interface Alert {
  id?: number;
  content: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface InputProps {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  type: string;
  placeholder?: string;
  error?: string;
  autofocus?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Task {
  name: string;
  completed: boolean;
  id: number;
}

export interface Event {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  location: string;
  description: string;
  space: string;
}
export interface Image {
  id: string;
  url: string;
  filename: string;
  timestamp: Date;
}

export interface Album {
  id: string;
  title: string;
  images: Image[];
}
