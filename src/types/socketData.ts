export type SocketData =
  | {
      category: 'online_users';
      online_users: number[];
    }
  | {
      category: 'status_update';
      user_id: number;
      is_online: boolean;
    }
  | {
      category: 'typing';
      chat_id: number;
      sender: number;
      typed: string;
    }
  | {
      category: 'new_message';
      id?: number;
      sender: number;
      chat: number;
      content: string;
      type?: string;
      file_name?: string;
      timestamp?: string | Date;
      file?: string | null;
    };
