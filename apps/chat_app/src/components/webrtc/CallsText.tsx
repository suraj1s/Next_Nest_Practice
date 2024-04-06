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

  // state for local localdescription and remote description after call start and answer , localdescription afet negotiation and remote description after nego
  const [localDescription, setLocalDescription] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [remoteDescription, setRemoteDescription] =
    useState<RTCSessionDescription | null>(null);
  const [localNegoDescription, setLocalNegoDescription] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [remoteNegoDescription, setRemoteNegoDescription] =
    useState<RTCSessionDescription | null>(null);

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
        setLocalDescription(offer);
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
    setRemoteDescription(offer);
    const answer = await webRTCServiceInstance.createAnswer(offer);
    setLocalDescription(answer);
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

  // set answer
  useEffect(() => {
    if (
      callAnswerResponse.status === true &&
      callAnswerResponse.answer !== ""
    ) {
      const answer = JSON.parse(callAnswerResponse.answer);
      setRemoteDescription(answer);
      webRTCServiceInstance.setAnswer(answer);
      console.log("call accepted from other peer", receiver);
      sendStreams();
    }
  }, [callAnswerResponse, sendStreams]);

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
    setLocalNegoDescription(offer);
    const stringifiedOffer = JSON.stringify(offer);
    // console.log(stringifiedOffer, "stringifiedOffer");
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
      setRemoteNegoDescription(offer);
      const answer = await webRTCServiceInstance.createAnswer(offer);
      setLocalNegoDescription(answer);
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
    const setNegoFinalAnswer = useCallback(async () => {
      if (negoAnswerResponse.answer !== "") {
        const answer = JSON.parse(negoAnswerResponse.answer);
        setRemoteNegoDescription(answer);
        await webRTCServiceInstance.setAnswer(answer);
        console.log(answer, "negoAnswerResponse answer ...");
      }
    }, [negoAnswerResponse]);
  
    useEffect(() => {
      setNegoFinalAnswer();
    }, [negoAnswerResponse]);


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



  return (
    <div className="flex flex-col gap-5">
      {/* <div className="text-sm font-normal gap-4 flex flex-col ">
        {localDescription && (
          <p className="border border-slate-300 rounded-md p-3">localDescription :
          <button  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          onClick={() => {
            webRTCServiceInstance.peer?.setLocalDescription(new RTCSessionDescription(localDescription));
          }}
          >
            set
          </button>
          </p>
        )}
        {remoteDescription && (
          <p className="border border-slate-300 rounded-md p-3">remoteDescription :  <button  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          onClick={() => {
            webRTCServiceInstance.peer?.setRemoteDescription(new RTCSessionDescription(remoteDescription));
          }}
          >
            set
          </button></p>
        )}
        {localNegoDescription && (
          <p className="border border-slate-300 rounded-md p-3">localNegoDescription : 
          <button  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          onClick={() => {
            webRTCServiceInstance.peer?.setLocalDescription(new RTCSessionDescription(localNegoDescription));
          }}
          >
            set
          </button></p>
        )}
        {remoteNegoDescription && (
          <p className="border border-slate-300 rounded-md p-3">remoteNegoDescription : 
           <button  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          onClick={() => {
            webRTCServiceInstance.peer?.setRemoteDescription(new RTCSessionDescription(remoteNegoDescription));
          }}
          >
            set
          </button>
          </p>
        )}
      </div> */}
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
      {localStream && (
        <button
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          onClick={sendStreams}
        >
          Send Stream
        </button>
      )}
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
