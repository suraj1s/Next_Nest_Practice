"use client";
import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import { userMediaIntance } from "@/services/userMedia";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICallsProps {
  caller: string;
  receiver: string;
}
const CallsTest = ({ caller, receiver }: ICallsProps) => {
  const stremeRef = useRef<any>(null);
  const otherPeerStremeRef = useRef<any>(null);

  const {
    startCall,
    answerCall,
    startNegotiation,
    answerNego,
    callReceive,
    callAnswerResponse,
    negoReceive,
    negoAnswerResponse,
  } = useSocket();

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [callAnswerStatus, setCallAnswerStatus] = useState<
    "Not Answered" | "Answered" | "Rejected"
  >("Not Answered");

  const handelCallStart = async ({
    callType,
  }: {
    callType: "AUDIO" | "VIDEO";
  }) => {
    if (typeof window !== "undefined") {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          // audio: true,
          video: true,
        });
        setLocalStream(localStream);
        const offer = await webRTCServiceInstance.createOffer();
        const stringifiedOffer = JSON.stringify(offer);
        startCall({ offer: stringifiedOffer, caller, receiver, callType });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };

  const handelAnswerCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      // audio: true,
      video: true,
    });
    setLocalStream(localStream);
    // console.log(callReceive.offer, "callReceive.offer");
    const offer = JSON.parse(callReceive.offer);
    const answer = await webRTCServiceInstance.createAnswer(offer);
    const stringifiedAnswer = JSON.stringify(answer);
    // console.log(stringifiedAnswer, "stringifiedAnswer");
    answerCall({
      answer: stringifiedAnswer,
      status: true,
      caller: callReceive.caller,
    });
    setCallAnswerStatus("Answered");
  };

  const sendStreams = useCallback(() => {
    if (webRTCServiceInstance.peer && localStream) {
      for (const track of localStream.getTracks()) {
        webRTCServiceInstance.peer.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  // set remote strem
  useEffect(() => {
    console.log(caller, callAnswerResponse, "callAnswerResponse");
    if (webRTCServiceInstance.peer) {
      webRTCServiceInstance.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log(remoteStream, "remoteStream");
        setRemoteStream(remoteStream[0]);
      });
    }
  }, []);

  // set answer
  useEffect(() => {
    if (
      callAnswerResponse.status === true &&
      callAnswerResponse.answer !== ""
    ) {
      const answer = JSON.parse(callAnswerResponse.answer);
      webRTCServiceInstance.setAnswer(answer);
      console.log("call accepted from other peer", receiver);
      sendStreams();
    }
  }, [callAnswerResponse]);

  useEffect(() => {
    stremeRef.current.srcObject = localStream;
    console.log(localStream, "localStream from useeffecat");
  }, [localStream]);

  useEffect(() => {
    otherPeerStremeRef.current.srcObject = remoteStream;
    console.log(remoteStream, "remoteStream from useeffecat");
  }, [remoteStream]);

  // negociation start
  const handelNegotiationNeeded = async () => {
    console.log("Negotiation needed", caller);
    const offer = await webRTCServiceInstance.createOffer();
    console.log("first offer", offer);
    const stringifiedOffer = JSON.stringify(offer);
    console.log(stringifiedOffer, "stringifiedOffer");
    startNegotiation({ offer: stringifiedOffer, to: receiver });
  };

  useEffect(() => {
    if (webRTCServiceInstance.peer) {
      webRTCServiceInstance.peer.addEventListener(
        "negotiationneeded",
        handelNegotiationNeeded
      );
    }
    return () => {
      webRTCServiceInstance.peer &&
        webRTCServiceInstance.peer.addEventListener(
          "negotiationneeded",
          handelNegotiationNeeded
        );
    };
  }, []);

  // negociation revieved
  const memoizedCallback = useCallback(async () => {
    console.log(negoReceive, "negoReceive ... inside useCallback");
    if (negoReceive.offer !== "") {
      const offer = JSON.parse(negoReceive.offer);
      const answer = await webRTCServiceInstance.createAnswer(offer);
      const stringifiedAnswer = JSON.stringify(answer);
      console.log(stringifiedAnswer, "stringifiedAnswer answer nego ...");
      answerNego({ answer: stringifiedAnswer, to: negoReceive.from });
    }
  }, [negoReceive]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback, negoReceive]);

  console.log(negoReceive, "negoReceive ...");

  // negociation answer received
  useEffect(() => {
    if (negoAnswerResponse.answer !== "") {
      const answer = JSON.parse(negoAnswerResponse.answer);
      console.log(answer, "negoAnswerResponse answer ...");
      webRTCServiceInstance.setAnswer(answer);
    }
  }, [negoAnswerResponse]);

  return (
    <div className="flex flex-col gap-5">
      {
        <div className="flex gap-x-4 text-sm  ">
          <button
            onClick={() => {
              handelCallStart({ callType: "VIDEO" });
            }}
            className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          >
            Video
          </button>
          <button
            onClick={async () => {
              await userMediaIntance?.closeAllStreams();
            }}
            className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          >
            Close Media
          </button>
        </div>
      }
      <div>
        {callReceive.offer !== "" && callReceive.caller !== "" && (
          <div>
            {callAnswerStatus === "Not Answered" && (
              <h1>
                {callReceive.caller} is calling you{" "}
                {"  " + callReceive.callType}
              </h1>
            )}
            {callAnswerStatus === "Not Answered" && (
              <div className="text-xs flex gap-4 py-3">
                <button
                  onClick={() => handelAnswerCall()}
                  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
                >
                  Accept Call
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* {localStream && <button onClick={sendStreams}>Send Stream</button>} */}
      <div className="flex justify-between gap-10">
        <div>
          <p>Peer video</p>
          <video
            ref={otherPeerStremeRef}
            autoPlay
            playsInline
            controls={true}
          />
        </div>
        <div>
          <p>Your video</p>
          <video ref={stremeRef} autoPlay playsInline controls={true} />
        </div>
      </div>
    </div>
  );
};

export default CallsTest;

// "use client"
// import React, { useEffect, useCallback, useState } from "react";
// import ReactPlayer from "react-player";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const CallsTest = () => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);
//       console.log(`Incoming Call`, from, offer);
//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     for (const track of myStream.getTracks()) {
//       peer.peer.addTrack(track, myStream);
//     }
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncomming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncomming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//   ]);

//   return (
//     <div>
//       <h1>Room Page</h1>
//       <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
//       {myStream && <button onClick={sendStreams}>Send Stream</button>}
//       {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
//       {myStream && (
//         <>
//           <h1>My Stream</h1>
//           <ReactPlayer
//             playing
//             muted
//             height="100px"
//             width="200px"
//             url={myStream}
//           />
//         </>
//       )}
//       {remoteStream && (
//         <>
//           <h1>Remote Stream</h1>
//           <ReactPlayer
//             playing
//             muted
//             height="100px"
//             width="200px"
//             url={remoteStream}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default CallsTest;
