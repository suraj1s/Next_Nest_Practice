"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?:any;
}

export interface IMessageType {
  message: string;
  room: string;
  user: string;

}
interface ISocketContext {
  sendMessage: (msg: IMessageType) => any;
  createRoom: (room: string) => any;
  messages: IMessageType | undefined;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // socket is local state to store the socket connection and send messages to the server
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IMessageType >();

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      if (socket) {
        socket.emit("client:message",  { message : msg} );
      }
    },
    [socket]
  );
  const createRoom: ISocketContext["createRoom"] = useCallback(
    (room) => {
      if (socket) {
        socket.emit("join:room", room );
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: IMessageType) => {
    // console.log("From Server ", msg);
    const message= msg;
    setMessages(message);
    // setMessages((prev) => [...prev, message]);
  }, []);

  // useEffect(() => {
  //   const _socket = io("http://localhost:8000");
  //   // _socket.on("server:message", (msg) => console.log( "from server " , msg));
  //   _socket.on("server:message", onMessageRec);
  //   setSocket(_socket);
  //   return () => {
  //     _socket.off("server:message", onMessageRec);
  //     _socket.disconnect();
  //     setSocket(undefined);
  //   };
  // }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages , createRoom }}>
      {children}
    </SocketContext.Provider>
  );
};