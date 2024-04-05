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
interface ICallAnswer {
  answer: string;
  caller: string;
  status: boolean;
}

interface ISocketContext {
  sendMessage: (msg: IMessageType) => void;
  createRoom: ({ room, user }: { room: string; user: string }) => void;
  startCall: ({ offer, caller, receiver }: IStartCall) => void;
  answerCall: ({ status, answer }: ICallAnswer) => void;
  messages: IMessageType | undefined;
  roomMembers: string[];
  callReceive: ICallReceive;
  callAnswer: ICallAnswer;
  callAnswerResponse: ICallAnswer;
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
  const [callAnswer, setCallAnswer] = useState<ICallAnswer>({
    status: false,
    caller: "",
    answer: "",
  });

  const [callAnswerResponse, setCallAnswerResponse] = useState<ICallAnswer>({
    status: false,
    answer: "",
    caller: "",
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

  const answerCall = useCallback(
    ({ answer, status, caller }: ICallAnswer) => {
      if (socket) {
        socket.emit("call:answer", { answer, status, caller });
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
  const onCallAnswer = useCallback(({ answer, status, caller }: ICallAnswer) => {
    console.log("call answer .........", answer, status, caller);
    setCallAnswerResponse({ answer, status, caller});
  }, []);

  // const Caller & Reciever
  const onCallEnd = useCallback((data: any) => {
    console.log("call end", data);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("server:message", onMessageReceived);
    _socket.on("room:userJoined", onRoomJoined);
    _socket.on("call:receive", onCallReceive);
    _socket.on("call:answer", onCallAnswer);
    _socket.on("call:end", onCallEnd);

    setSocket(_socket);

    return () => {
      _socket.off("server:message", onMessageReceived);
      _socket.off("room:userJoined", onRoomJoined);
      _socket.off("call:receive", onCallReceive);
      _socket.off("call:answer", onCallAnswer);

      _socket.off("call:end", onCallEnd);
      _socket.disconnect();
    };
  }, []);

  const socketValue = useMemo(
    () => ({
      sendMessage,
      createRoom,
      startCall,
      answerCall,
      messages,
      roomMembers,
      callReceive,
      callAnswer,
      callAnswerResponse,
    }),
    [
      sendMessage,
      createRoom,
      startCall,
      answerCall,
      messages,
      roomMembers,
      callReceive,
      callAnswer,
      callAnswerResponse,
    ]
  );

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};
