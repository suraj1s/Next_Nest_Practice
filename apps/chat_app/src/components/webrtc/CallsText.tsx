"use client";
import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import { userMediaIntance } from "@/services/userMedia";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICallsProps {
  caller: string;
  receiver: string;
}
const CallsText = ({ caller, receiver }: ICallsProps) => {
  const { startCall, answerCall, startNegotiation, callReceive } = useSocket();

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [callAnswerStatus, setCallAnswerStatus] = useState<
    "Not Answered" | "Answered" | "Rejected"
  >("Not Answered");

  const [streamTitleLocal, setStreamTitleLocal] = useState<
    "AUDIO" | "VIDEO" | "No Stream Selected"
  >("No Stream Selected");
  const [streamTitleRemote, setStreamTitleRemote] = useState<
    "AUDIO" | "VIDEO" | "No Stream Selected"
  >("No Stream Selected");
  const localStremeRef = useRef<any>(null);
  const remoteStremeRef = useRef<any>(null);

  // const sendStreams = useCallback(() => {
  //   if (webRTCServiceInstance.peer && userMediaIntance.mediaInstance) {
  //     // console.log(webRTCServiceInstance.peer, "webRTCServiceInstance.peer");
  //     for (const track of userMediaIntance.mediaInstance.getTracks()) {
  //       webRTCServiceInstance.peer.addTrack(
  //         track,
  //         userMediaIntance.mediaInstance
  //       );
  //     }
  //   }
  // }, [userMediaIntance.mediaInstance]);

  const sendStreams = useCallback(() => {
    if (webRTCServiceInstance.peer && userMediaIntance?.mediaInstance) {
      console.log(webRTCServiceInstance.peer, "webRTCServiceInstance.peer");

      // Remove existing tracks
      const senders = webRTCServiceInstance.peer.getSenders();
      senders.forEach((sender) => {
        webRTCServiceInstance.peer &&
          webRTCServiceInstance.peer.removeTrack(sender);
      });

      // Add new tracks
      for (const track of userMediaIntance?.mediaInstance.getTracks()) {
        webRTCServiceInstance.peer.addTrack(
          track,
          userMediaIntance?.mediaInstance
        );
      }
    }
  }, [webRTCServiceInstance.peer, userMediaIntance?.mediaInstance]);

  useEffect(() => {
    if (userMediaIntance) {
      // console.log(userMediaIntance.getMediaStream(), " userMediaIntance");
      if (streamTitleLocal !== "No Stream Selected") {
        localStremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
    }
  }, [userMediaIntance, streamTitleLocal]);

  useEffect(() => {
    if (remoteStream) {
      // console.log(remoteStream, " remote strem");
      if (streamTitleRemote !== "No Stream Selected") {
        remoteStremeRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream, streamTitleRemote]);

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
          await userMediaIntance?.openVideoStream();
          setStreamTitleLocal("VIDEO");
        }
        if (audio) {
          await userMediaIntance?.openAudioStream();
          setStreamTitleLocal("AUDIO");
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
        // handleOpenMedia({ video: true });
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
    callReceive.callType === "AUDIO"
      ? await handleOpenMedia({ audio: true })
      : await handleOpenMedia({ video: true });
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

  // negociation start
  const handelNegotiationNeeded = async () => {
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
        setStreamTitleRemote(
          remoteStream[0].getVideoTracks().length > 0 ? "VIDEO" : "AUDIO"
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
                  className="btn-primary "
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
            setStreamTitleLocal("No Stream Selected");
          }}
          className="btn-primary "
        >
          Close Media
        </button>
      </div>
      {streamTitleLocal !== "No Stream Selected" && (
        <div className="flex gap-x-4 text-sm  ">
          <button
            onClick={() => handelCallStart({ callType: streamTitleLocal })}
            className="btn-primary "
          >
            Start Call
          </button>
          {/* <button className="btn-primary ">End Call</button> */}
        </div>
      )}
      {userMediaIntance.mediaInstance && (
        <button className="btn-primary !w-fit text-xs" onClick={sendStreams}>
          Send Stream
        </button>
      )}
      <div>
        <h1> You {streamTitleLocal}</h1>
        <div>
          <audio
            ref={localStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitleLocal === "AUDIO" ? "block" : "hidden"}`}
          />
          <video
            ref={localStremeRef}
            width={400}
            height={300}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitleLocal === "VIDEO" ? "block" : "hidden"}`}
          />
        </div>
      </div>
      <div>
        <h1> Peer {streamTitleRemote}</h1>
        <div>
          <audio
            ref={remoteStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitleRemote === "AUDIO" ? "block" : "hidden"}`}
          />
          <video
            ref={remoteStremeRef}
            width={400}
            height={300}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitleRemote === "VIDEO" ? "block" : "hidden"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CallsText;
