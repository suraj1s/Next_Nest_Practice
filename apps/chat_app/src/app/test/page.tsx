"use client";
import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import { userMediaIntance } from "@/services/userMedia";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface ICallsProps {
  caller: string;
  receiver: string;
}
const Page = ({ caller, receiver }: ICallsProps) => {
  const { startCall, answerCall, startNegotiation, callReceive } = useSocket();

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [callAnswerStatus, setCallAnswerStatus] = useState<
    "Not Answered" | "Answered" | "Rejected"
  >("Not Answered");

  const [streamTitle, setStreamTitle] = useState< "AUDIO" | "VIDEO" |"No Stream Selected" >("No Stream Selected");
  const localStremeRef = useRef<any>(null);
  const remoteStremeRef = useRef<any>(null);

  useEffect(() => {
    if (userMediaIntance) {
      console.log(userMediaIntance.getMediaStream(), " userMediaIntance");
      if (streamTitle !== "No Stream Selected") {
        localStremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
    }
  }, [userMediaIntance, streamTitle]);

  const handleOpenMedia = async ({
    video,
    audio,
  }: {
    video?: boolean;
    audio?: boolean;
  }) => {
    try {
      if (userMediaIntance) {
        if (video) {
          console.log(video, " video");
          await userMediaIntance?.openVideoStream();
          setStreamTitle("VIDEO");
        }
        if (audio) {
          console.log(audio, " audio");
          await userMediaIntance?.openAudioStream();
          setStreamTitle("AUDIO");
        }
      }
    } catch (error) {
      console.error("Error opening media stream:", error);
    }
  };

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
        const offer = await webRTCServiceInstance.createOffer({
          type: "call",
        });
        startCall({ offer, caller, receiver, callType });
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
    //  // console.log(callReceive.offer, "callReceive.offer");
    const offer = callReceive.offer;
    const answer = await webRTCServiceInstance.createAnswer({
      offer,

      type: "call",
    });
    answerCall({
      answer,
      status: true,
      caller: callReceive.caller,
    });
    setCallAnswerStatus("Answered");
  };

  const sendStreams = useCallback(() => {
    if (webRTCServiceInstance.peer && localStream) {
      console.log(webRTCServiceInstance.peer, "webRTCServiceInstance.peer");
      for (const track of localStream.getTracks()) {
        webRTCServiceInstance.peer.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  // negociation start
  const handelNegotiationNeeded = async () => {
    console.log("Negotiation needed", caller);
    const offer = await webRTCServiceInstance.createOffer({
      type: "nego",
    });
    if (callReceive.caller === "") {
      startNegotiation({ offer, to: receiver });
    } else {
      startNegotiation({ offer, to: callReceive.caller });
    }
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
  }, [startNegotiation]);

  // set remote strem
  useEffect(() => {
    // console.log(caller, callAnswerResponse, "callAnswerResponse");
    if (webRTCServiceInstance.peer) {
      webRTCServiceInstance.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log(
          remoteStream,
          "remoteStream recieved form another user....."
        );
        setRemoteStream(remoteStream[0]);
      });
    }
  }, []);

  return (
    <div className="flex container flex-col gap-5">
      <div>
        {callReceive.offer !== null && callReceive.caller !== "" && (
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
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={() => handleOpenMedia({ audio: true })}
          className="btn-primary"
        >
          Audio
        </button>
        <button
          onClick={() => handleOpenMedia({ video: true })}
          className="btn-primary "
        >
          Video
        </button>
        <button
          onClick={async () => {
            await userMediaIntance?.closeAllStreams();
            setStreamTitle("No Stream Selected");
          }}
          className="btn-primary "
        >
          Close Media
        </button>
      </div>
      {streamTitle !== "No Stream Selected" && (
        <div className="flex gap-x-4 text-sm  ">
          <button onClick={ () => handelCallStart({callType : "AUDIO"})} className="btn-primary">Start Call</button>
          {/* <button className="btn-primary ">End Call</button> */}
        </div>
      )}
      <div>
        <h1> You {streamTitle}</h1>
        <div>
          <audio
            ref={localStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "AUDIO" ? "block" : "hidden"}`}
          />
          <video
            ref={localStremeRef}
            width={400}
            height={300}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "VIDEO" ? "block" : "hidden"}`}
          />
        </div>
      </div>
      <div>
        <h1> Peer {streamTitle}</h1>
        <div>
          <audio
            ref={remoteStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "AUDIO" ? "block" : "hidden"}`}
          />
          <video
            ref={remoteStremeRef}
            width={400}
            height={300}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "VIDEO" ? "block" : "hidden"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
