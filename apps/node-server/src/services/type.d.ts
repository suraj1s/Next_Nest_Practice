interface Room {
    id: string;
    users: string[];
  }
  
  interface User {
    id: string;
    name: string;
  }
  
  interface Message {
    message: string;
    room: string;
    user: User;
  }

  interface UserToSocketMap {
    [user: string]: string;
  }

  interface SocketToUserMap {
    [socket: string]: string;
  }