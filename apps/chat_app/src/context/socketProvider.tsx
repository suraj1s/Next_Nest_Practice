"use client";

import { webRTCServiceInstance } from "@/services/useWebRTC";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  ICallAnswer,
  ICallReceive,
  IMessageType,
  INegotiationAnswer,
  INegotiationReceive,
  INegotiationStart,
  ISocketContext,
  IStartCall,
  SocketProviderProps,
} from "./type";

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`Socket context is not available`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IMessageType | undefined>();
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [callReceive, setCallReceive] = useState<ICallReceive>({
    caller: "",
    offer: null,
    callType: "AUDIO",
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
        // console.log(room, user, "room user");
        socket.emit("room:join", { room, user });
      }
    },
    [socket]
  );

  const startCall = useCallback(
    ({ offer, caller, receiver, callType }: IStartCall) => {
      if (socket) {
        socket.emit("call:start", { offer, caller, receiver, callType });
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

  const startNegotiation = useCallback(
    ({ offer, to }: INegotiationStart) => {
      if (socket) {
        console.log("start nego === :: ", { offer, to });
        socket.emit("nego:start", { offer, to });
      }
    },
    [socket]
  );

  const onRoomJoined = useCallback((user: { users: string[] }) => {
    // console.log("uer joined room", user);
    setRoomMembers(user.users);
  }, []);

  const onMessageReceived = useCallback((msg: IMessageType) => {
    setMessages(msg);
  }, []);

  // for Reviever
  const onCallReceive = useCallback(
    ({ offer, caller, callType }: ICallReceive) => {
      // console.log("call received ", { caller, offer, callType });
      setCallReceive({ caller, offer, callType });
    },
    []
  );

  // for Caller
  const onCallAnswer = useCallback(
    ({ answer, status, caller }: ICallAnswer) => {
      // console.log("call answer .........", answer, status, caller);
      webRTCServiceInstance.setAnswer({
        answer,
        type: "call",
      });
    },
    []
  );

  const onNegoReceive1 = async ({ offer, from , socket }: any) => {
    console.log("negotiation received === ::: ", { offer, from});
    const answer = await webRTCServiceInstance.createAnswer({
      offer,
      type: "nego",
    });
    socket && socket.emit("nego:answer", { answer, to : from });
  };
  // const onNegoReceive = useCallback(
  //   async ({ offer, from }: INegotiationReceive) => {
  //     console.log("negotiation received === ::: ", { offer, from });
  //     const answer = await webRTCServiceInstance.createAnswer({
  //       offer,
  //       type: "nego",
  //     });
  //     console.log(
  //       "answer nego === :: socket&& ",
  //       { answer, from },
  //       " socket",
  //       socket
  //     );
  //     socket && socket.emit("nego:answer", { answer, from });
  //   },
  //   [socket]
  // );

  // for Caller
  const onNegoAnswer = useCallback(
    async ({ answer }: { answer: RTCSessionDescriptionInit | null }) => {
      console.log("nego answer === :::", answer);
      await webRTCServiceInstance.setAnswer({
        answer,
        type: "nego",
      });
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("server:message", onMessageReceived);
    _socket.on("room:userJoined", onRoomJoined);
    _socket.on("call:receive", onCallReceive);
    _socket.on("call:answer", onCallAnswer);
    _socket.on("nego:receive", ({ offer, from }: INegotiationReceive)=> {
      onNegoReceive1({ offer, from , socket: _socket });
    });
    _socket.on("nego:answer", onNegoAnswer);

    setSocket(_socket);

    return () => {
      _socket.off("server:message", onMessageReceived);
      _socket.off("room:userJoined", onRoomJoined);
      _socket.off("call:receive", onCallReceive);
      _socket.off("call:answer", onCallAnswer);
      // _socket.off("nego:receive", onNegoReceive);
      _socket.off("nego:answer", onNegoAnswer);
      _socket.disconnect();
    };
  }, []);

  const socketValue = useMemo(
    () => ({
      sendMessage,
      createRoom,
      startCall,
      answerCall,
      startNegotiation,
      messages,
      roomMembers,
      callReceive,
      // callAnswer,
    }),
    [
      sendMessage,
      createRoom,
      startCall,
      answerCall,
      startNegotiation,
      messages,
      roomMembers,
      callReceive,
      // callAnswer,
    ]
  );

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};
