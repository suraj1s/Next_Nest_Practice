// "use client";

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { io, Socket } from "socket.io-client";

// export interface IMessageType {
//   message: string;
//   room: string;
//   user: string;
// }
// interface IStartCall {
//   offer: string;
//   caller: string;
//   callType: "AUDIO" | "VIDEO";
//   receiver: string;
// }

// interface ICallReceive {
//   caller: string;
//   offer: string;
//   callType: "AUDIO" | "VIDEO";
// }
// interface ICallAnswer {
//   answer: string;
//   caller: string;
//   status: boolean;
// }

// interface INegotiationStart {
//   offer: string;
//   to: string;
// }
// interface INegotiationReceive {
//   offer: string;
//   from: string;
// }

// interface INegotiationAnswer {
//   answer: string;
//   to: string;
// }

// interface ISocketContext {
//   sendMessage: (msg: IMessageType) => void;
//   createRoom: ({ room, user }: { room: string; user: string }) => void;
//   startCall: ({ offer, caller, receiver, callType }: IStartCall) => void;
//   answerCall: ({ status, answer }: ICallAnswer) => void;
//   startNegotiation: ({ offer, to }: INegotiationStart) => void;
//   answerNego: ({ answer, to }: INegotiationAnswer) => void;
//   messages: IMessageType | undefined;
//   roomMembers: string[];
//   callReceive: ICallReceive;
//   // callAnswer: ICallAnswer;
//   callAnswerResponse: ICallAnswer;
//   negoAnswerResponse: { answer: string };
//   negoReceive: INegotiationReceive;
//   _socket: Socket;
// }

// interface SocketProviderProps {
//   children?: React.ReactNode;
// }

// const SocketContext = createContext<ISocketContext | null>(null);

// export const useSocket = () => {
//   const state = useContext(SocketContext);
//   if (!state) throw new Error(`Socket context is not available`);
//   return state;
// };

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | undefined>();
//   const [messages, setMessages] = useState<IMessageType | undefined>();
//   const [roomMembers, setRoomMembers] = useState<string[]>([]);
//   const [callReceive, setCallReceive] = useState<ICallReceive>({
//     caller: "",
//     offer: "",
//     callType: "AUDIO",
//   });
//   // const [callAnswer, setCallAnswer] = useState<ICallAnswer>({
//   //   status: false,
//   //   caller: "",
//   //   answer: "",
//   // });
//   const [negoReceive, setNegoReceive] = useState<INegotiationReceive>({
//     offer: "",
//     from: "",
//   });

//   const [callAnswerResponse, setCallAnswerResponse] = useState<ICallAnswer>({
//     status: false,
//     answer: "",
//     caller: "",
//   });

//   const [negoAnswerResponse, setNegoAnswerResponse] = useState({
//     answer: "",
//   });

//   const sendMessage = useCallback(
//     (msg: IMessageType) => {
//       if (socket) {
//         socket.emit("client:message", { message: msg });
//       }
//     },
//     [socket]
//   );

//   const createRoom = useCallback(
//     ({ room, user }: { room: string; user: string }) => {
//       if (socket) {
//         console.log(room, user, "room user");
//         socket.emit("room:join", { room, user });
//       }
//     },
//     [socket]
//   );

//   const startCall = useCallback(
//     ({ offer, caller, receiver, callType }: IStartCall) => {
//       if (socket) {
//         socket.emit("call:start", { offer, caller, receiver, callType });
//       }
//     },
//     [socket]
//   );

//   const answerCall = useCallback(
//     ({ answer, status, caller }: ICallAnswer) => {
//       if (socket) {
//         socket.emit("call:answer", { answer, status, caller });
//       }
//     },
//     [socket]
//   );

//   const startNegotiation = useCallback(
//     ({ offer, to }: INegotiationStart) => {
//       if (socket) {
//         socket.emit("nego:start", { offer, to });
//       }
//     },
//     [socket]
//   );

//   const answerNego = useCallback(
//     ({ answer, to }: INegotiationAnswer) => {
//       if (socket) {
//         socket.emit("nego:answer", { answer, to });
//       }
//     },
//     [socket]
//   );

//   const onRoomJoined = useCallback((user: { users: string[] }) => {
//     console.log("uer joined room", user);
//     setRoomMembers(user.users);
//   }, []);

//   const onMessageReceived = useCallback((msg: IMessageType) => {
//     setMessages(msg);
//   }, []);

//   // // for Caller
//   // const onCallStart = useCallback((data: any) => {
//   //   console.log("call start", data);
//   // }, []);

//   // for Reviever
//   const onCallReceive = useCallback(
//     ({ offer, caller, callType }: ICallReceive) => {
//       console.log("call received ", { caller, offer, callType });
//       setCallReceive({ caller, offer, callType });
//     },
//     []
//   );

//   // for Caller
//   const onCallAnswer = useCallback(
//     ({ answer, status, caller }: ICallAnswer) => {
//       console.log("call answer .........", answer, status, caller);
//       setCallAnswerResponse({ answer, status, caller });
//     },
//     []
//   );

//   // const Caller & Reciever
//   const onCallEnd = useCallback((data: any) => {
//     console.log("call end", data);
//   }, []);

//   const onNegoReceive = useCallback(({ offer, from }: INegotiationReceive) => {
//     console.log("negotiation received", { offer, from });
//     setNegoReceive({ offer, from });
//   }, []);

//   // for Caller
//   const onNegoAnswer = useCallback(({ answer }: { answer: string }) => {
//     console.log("nego answer.........", answer);
//     setNegoAnswerResponse({ answer });
//   }, []);

//   const _socket = useMemo(() => io("localhost:8000"), []);
//   useEffect(() => {
//     _socket.on("server:message", onMessageReceived);
//     _socket.on("room:userJoined", onRoomJoined);
//     // _socket.on("call:receive", onCallReceive);
//     // _socket.on("call:answer", onCallAnswer);
//     // _socket.on("nego:receive", onNegoReceive);
//     // _socket.on("nego:answer", onNegoAnswer);
//     // _socket.on("call:end", onCallEnd);

//     setSocket(_socket);

//     return () => {
//       _socket.off("server:message", onMessageReceived);
//       _socket.off("room:userJoined", onRoomJoined);
//     //   _socket.off("call:receive", onCallReceive);
//     //   _socket.off("call:answer", onCallAnswer);
//     //   _socket.off("nego:receive", onNegoReceive);
//     //   _socket.off("nego:answer", onNegoAnswer);
//     //   _socket.off("call:end", onCallEnd);
//       _socket.disconnect();
//     };
//   }, []);

//   const socketValue = useMemo(
//     () => ({
//       sendMessage,
//       createRoom,
//       startCall,
//       answerCall,
//       startNegotiation,
//       answerNego,
//       _socket,
//       messages,
//       roomMembers,
//       callReceive,
//       // callAnswer,
//       callAnswerResponse,
//       negoReceive,
//       negoAnswerResponse,
//     }),
//     [
//       sendMessage,
//       createRoom,
//       startCall,
//       answerCall,
//       startNegotiation,
//       answerNego,
//       _socket,
//       messages,
//       roomMembers,
//       callReceive,
//       // callAnswer,
//       callAnswerResponse,
//       negoReceive,
//       negoAnswerResponse,
//     ]
//   );

//   return (
//     <SocketContext.Provider value={socketValue}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
