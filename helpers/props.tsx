export interface Chat {
  id: number;
  other_participant: User;
  last_message_content: null;
  last_message_time: null;
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
}
