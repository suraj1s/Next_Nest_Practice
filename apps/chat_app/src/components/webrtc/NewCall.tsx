import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";

interface ICallsProps {
  caller: string;
  receiver: string;
}

const NewCall = ({ caller, receiver }: ICallsProps) => {
  const {
    startCall,
    answerCall,
    startNegotiation,
    answerNego,
    callReceive,
    callAnswerResponse,
    negoAnswerResponse,
    negoReceive,
  } = useSocket();

  const [myStream, setMyStream] = useState<any>();
  const [remoteStream, setRemoteStream] = useState<any>();

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await webRTCServiceInstance.createOffer();
    // const stringifiedOffer = JSON.stringify(offer);
    startCall({
      receiver: receiver,
      caller,
      callType: "VIDEO",
      offer,
    });
    setMyStream(stream);
  }, []);

  //   const handleIncommingCall = useCallback(async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: true,
  //     });
  //     setMyStream(stream);
  //     console.log(`Incoming Call`, callReceive.caller, callReceive.offer);
  //     // const parsedOffer = JSON.parse(callReceive.offer);
  //     const ans = await webRTCServiceInstance.createAnswer(callReceive.offer);
  //     // const answer = JSON.stringify(ans);
  //     answerCall({ answer : ans, status: true, caller: callReceive.caller });
  //   }, [callReceive]);
  const handleIncommingCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log(`Incoming Call`, callReceive.caller, callReceive.offer);

    // Set remote offer before creating answer
    await webRTCServiceInstance.peer.setRemoteDescription(
      new RTCSessionDescription(callReceive.offer)
    );

    const ans = await webRTCServiceInstance.createAnswer(callReceive.offer);
    answerCall({ answer: ans, status: true, caller: callReceive.caller });
  }, [callReceive]);

  useEffect(() => {
    if (callReceive.offer !== "") {
      handleIncommingCall();
    }
  }, [callReceive, handleIncommingCall]);
  const sendStreams = useCallback(() => {
    if (webRTCServiceInstance.peer) {
      for (const track of myStream.getTracks()) {
        webRTCServiceInstance.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  //   const handleCallAccepted = useCallback(
  //     ({ from, ans }) => {
  //       peer.setLocalDescription(ans);
  //       console.log("Call Accepted!");
  //       sendStreams();
  //     },
  //     [sendStreams]
  //   );

  // set answer
  useEffect(() => {
    if (
      callAnswerResponse.status === true &&
      callAnswerResponse.answer !== ""
    ) {
      //   const answer = JSON.parse(callAnswerResponse.answer);
      webRTCServiceInstance.setAnswer(callAnswerResponse.answer);
      console.log("call accepted from other peer", receiver);
      sendStreams();
    }
  }, [callAnswerResponse, sendStreams]);

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
  //     await webRTCServiceInstance.setAnswer(ans);
  //   }, []);

  // negociation start
  const handelNegotiationNeeded = async () => {
    console.log("Negotiation needed", caller);
    const offer = await webRTCServiceInstance.createOffer();
    // const stringifiedOffer = JSON.stringify(offer);
    // console.log(stringifiedOffer, "stringifiedOffer");
    startNegotiation({ offer, to: receiver });
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
      //   const offer = JSON.parse(negoReceive.offer);
      const answer = await webRTCServiceInstance.createAnswer(
        negoReceive.offer
      );
      //   const stringifiedAnswer = JSON.stringify(answer);
      console.log(answer, "stringifiedAnswer answer nego ...");
      answerNego({ answer, to: negoReceive.from });
    }
  }, [negoReceive]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback, negoReceive]);

  console.log(negoReceive, "negoReceive ...");

  // negociation answer received
  const setNegoFinalAnswer = useCallback(async () => {
    if (negoAnswerResponse.answer !== "") {
      //   const answer = JSON.parse(negoAnswerResponse.answer);
      await webRTCServiceInstance.setAnswer(negoAnswerResponse.answer);
      //   console.log(answer, "negoAnswerResponse answer ...");
    }
  }, [negoAnswerResponse]);

  useEffect(() => {
    setNegoFinalAnswer();
  }, [negoAnswerResponse]);

  useEffect(() => {
    webRTCServiceInstance.peer &&
      webRTCServiceInstance.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream[0]);
      });
  }, []);
  return (
    <div>
      <h1>Room Page</h1>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {<button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default NewCall;
