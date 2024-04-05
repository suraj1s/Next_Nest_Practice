"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export interface IMessageType {
  message: string;
  room: string;
  user: string;
}
interface IStartCall {
  offer: string;
  caller: string;
  receiver: string;
}

interface ICallReceive {
  caller: string;
  offer: string;
}
interface ISocketContext {
  sendMessage: (msg: IMessageType) => void;
  createRoom: ({ room, user }: { room: string; user: string }) => void;
  startCall: ({ offer, caller, receiver }: IStartCall) => void;
  messages: IMessageType | undefined;
  roomMembers: string[];
  callReceive: ICallReceive;
}

interface SocketProviderProps {
  children?: React.ReactNode;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`Socket context is not available`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<IMessageType | undefined>();
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [callReceive, setCallReceive] = useState({
    caller: "",
    offer: "",
  });

  const sendMessage = useCallback(
    (msg: IMessageType) => {
      if (socket) {
        socket.emit("client:message", { message: msg });
      }
    },
    [socket]
  );

  const createRoom = useCallback(
    ({ room, user }: { room: string; user: string }) => {
      if (socket) {
        console.log(room, user, "room user");
        socket.emit("room:join", { room, user });
      }
    },
    [socket]
  );

  const startCall = useCallback(
    ({
      offer,
      caller,
      receiver,
    }: {
      offer: string;
      caller: string;
      receiver: string;
    }) => {
      if (socket) {
        socket.emit("call:start", { offer, caller, receiver });
      }
    },
    [socket]
  );

  const onRoomJoined = useCallback((user: { users: string[] }) => {
    console.log("uer joined room", user);
    setRoomMembers(user.users);
  }, []);

  const onMessageReceived = useCallback((msg: IMessageType) => {
    setMessages(msg);
  }, []);

  // // for Caller
  // const onCallStart = useCallback((data: any) => {
  //   console.log("call start", data);
  // }, []);

  // for Reviever
  const onCallReceive = useCallback(({ offer, caller }: ICallReceive) => {
    console.log("call received ", { caller, offer });
    setCallReceive({ caller, offer });
  }, []);

  // for Caller
  const onCallAnswer = useCallback((data: any) => {
    console.log("call answer", data);
  }, []);

  // for Caller
  const onCallReject = useCallback((data: any) => {
    console.log("call reject", data);
  }, []);

  // const Caller & Reciever
  const onCallEnd = useCallback((data: any) => {
    console.log("call end", data);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("server:message", onMessageReceived);
    _socket.on("room:userJoined", onRoomJoined);
    // _socket.on("call:start", onCallStart);
    _socket.on("call:receive", onCallReceive);
    _socket.on("call:answer", onCallAnswer);
    _socket.on("call:reject", onCallReject);
    _socket.on("call:end", onCallEnd);

    setSocket(_socket);

    return () => {
      _socket.off("server:message", onMessageReceived);
      _socket.off("room:userJoined", onRoomJoined);
      // _socket.off("call:start", onCallStart);
      _socket.off("call:receive", onCallReceive);
      _socket.off("call:answer", onCallAnswer);
      _socket.off("call:reject", onCallReject);
      _socket.off("call:end", onCallEnd);
      _socket.disconnect();
    };
  }, []);

  const socketValue = useMemo(
    () => ({
      sendMessage,
      createRoom,
      startCall,
      messages,
      roomMembers,
      callReceive,
    }),
    [sendMessage, createRoom, startCall, messages, roomMembers, callReceive]
  );

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};

// "use client";
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { io, Socket } from "socket.io-client";

// interface SocketProviderProps {
//   children?: any;
// }

// export interface IMessageType {
//   message: string;
//   room: string;
//   user: string;
// }
// interface ISocketContext {
//   sendMessage: (msg: IMessageType) => any;
//   createRoom: ({ room, user }: { room: string; user: string }) => any;
//   messages: IMessageType | undefined;
//   roomMembers: string[];
// }

// const SocketContext = createContext<ISocketContext | null>(null);

// export const useSocket = () => {
//   const state = useContext(SocketContext);
//   if (!state) throw new Error(`state is undefined`);

//   return state;
// };

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   // socket is local state to store the socket connection and send messages to the server
//   const [socket, setSocket] = useState<Socket>();
//   const [messages, setMessages] = useState<IMessageType>();
//   const [roomMembers, setRoomMembers] = useState<string[]>([]);

//   const sendMessage: ISocketContext["sendMessage"] = useCallback(
//     (msg) => {
//       if (socket) {
//         socket.emit("client:message", { message: msg });
//       }
//     },
//     [socket]
//   );

//   const createRoom: ISocketContext["createRoom"] = useCallback(
//     ({ room, user }: { room: string; user: string }) => {
//       if (socket) {
//         console.log(room , user , "room user")
//         socket.emit("room:join", {room, user});
//       }
//     },
//     [socket]
//   );

//   const onRoomJoined = useCallback((user: string) => {
//     // console.log(user , " user" , roomMembers, " roomMembers")
//     console.log(user, "users in room")
//     setRoomMembers([...roomMembers, user]);
//   }, []);

//   const onMessageRec = useCallback((msg: IMessageType) => {
//     console.log("From Server ", msg);
//     const message = msg;
//     setMessages(message);
//     // setMessages((prev) => [...prev, message]);
//   }, []);

//   useEffect(() => {
//     const _socket = io("http://localhost:8000");
//     // _socket.on("server:message", (msg) => console.log( "from server " , msg));
//     _socket.on("server:message", onMessageRec);
//     _socket.on("room:userJoined", onRoomJoined);
//     setSocket(_socket);
//     return () => {
//       _socket.off("server:message", onMessageRec);
//       _socket.off("room:userJoined", onRoomJoined);
//       _socket.disconnect();
//       setSocket(undefined);
//     };
//   }, []);

//   return (
//     <SocketContext.Provider
//       value={{ sendMessage, messages, roomMembers, createRoom }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
