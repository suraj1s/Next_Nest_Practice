
export interface IMessageType {
    message: string;
    room: string;
    user: string;
  }
  export interface IStartCall {
    offer: RTCSessionDescriptionInit | null;
    caller: string;
    callType: "AUDIO" | "VIDEO";
    receiver: string;
  }
  
  export interface ICallReceive {
    caller: string;
    offer: RTCSessionDescriptionInit | null;
    callType: "AUDIO" | "VIDEO";
  }
  export interface ICallAnswer {
    answer: RTCSessionDescriptionInit | null;
    caller: string;
    status: boolean;
  }
  
  export interface INegotiationStart {
    offer: RTCSessionDescriptionInit | null;
    to: string;
  }
  export interface INegotiationReceive {
    offer: RTCSessionDescriptionInit | null;
    from: string;
  }
  
  export interface INegotiationAnswer {
    answer: RTCSessionDescriptionInit | null;
    to: string;
  }
  
  export interface ISocketContext {
    sendMessage: (msg: IMessageType) => void;
    createRoom: ({ room, user }: { room: string; user: string }) => void;
    startCall: ({ offer, caller, receiver, callType }: IStartCall) => void;
    answerCall: ({ status, answer }: ICallAnswer) => void;
    startNegotiation: ({ offer, to }: INegotiationStart) => void;
    messages: IMessageType | undefined;
    roomMembers: string[];
    callReceive: ICallReceive;
    // callAnswer: ICallAnswer;
  }
  
  export interface SocketProviderProps {
    children?: any;
  }
  