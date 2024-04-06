"use client";
import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import { userMediaIntance } from "@/services/userMedia";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICallsProps {
  caller: string;
  receiver: string;
}
const Calls = ({ caller, receiver }: ICallsProps) => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const stremeRef = useRef<any>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const otherPeerStremeRef = useRef<any>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [callAnswerStatus, setCallAnswerStatus] = useState<
    "Not Answered" | "Answered" | "Rejected"
  >("Not Answered");
  const { startCall, answerCall, callReceive, callAnswerResponse } =
    useSocket();

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
          // console.log(video, " video");
          await userMediaIntance?.openVideoStream();
          setStreamTitle("Video");
        }
        if (audio) {
          // console.log(audio, " audio");
          await userMediaIntance?.openAudioStream();
          setStreamTitle("Audio");
        }
      }
    } catch (error) {
      console.error("Error opening media stream:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handelCallStart = async ({
    callType,
  }: {
    callType: "AUDIO" | "VIDEO";
  }) => {
    if (typeof window !== "undefined" && isClient) {
      try {
        const offer = await webRTCServiceInstance.createOffer();
        const stringifiedOffer = JSON.stringify(offer);
        startCall({ offer: stringifiedOffer, caller, receiver, callType });
        // console.log("offer", JSON.stringify(offer));
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };

  // set stram after connection
  const sendStreams = useCallback(() => {
    console.log(
      "send stram:   ",
      userMediaIntance.mediaInstance,
      "sendStreams",
      webRTCServiceInstance.peer,
      "webRTCServiceInstance.peer"
    );
    if (
      userMediaIntance.mediaInstance !== null &&
      webRTCServiceInstance.peer !== null
    ) {
      for (const track of userMediaIntance?.mediaInstance?.getTracks()) {
        webRTCServiceInstance.peer.addTrack(
          track,
          userMediaIntance.mediaInstance
        );
      }
    }
  }, [userMediaIntance.mediaInstance, webRTCServiceInstance.peer]);

  // set answer after connection
  useEffect(() => {
    if (
      callAnswerResponse.answer !== ""
      // callAnswerResponse.status === true &&
      // callAnswerResponse.caller === receiver
    ) {
      webRTCServiceInstance.setAnswer(JSON.parse(callAnswerResponse.answer));
      sendStreams();
    }
  }, [callAnswerResponse]);

  // add remote stream for rendering strem
  useEffect(() => {
    if (
      userMediaIntance.mediaInstance !== null &&
      webRTCServiceInstance.peer !== null
    ) {
      console.log("GOT TRACKS!!");
      webRTCServiceInstance.peer.addEventListener("track", async (event) => {
        const remoteStream = event.streams;
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream[0]);
      });
    }

  }, [userMediaIntance.mediaInstance, webRTCServiceInstance.peer]);

  // render local strem
  useEffect(() => {
    if (userMediaIntance) {
      console.log(
        userMediaIntance.getMediaStream(),
        " local  userMediaIntance"
      );
      if (streamTitle === "Audio") {
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
      if (streamTitle === "Video") {
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
    }
  }, [userMediaIntance, streamTitle]);

  // render remote strem
  useEffect(() => {
    console.log(remoteStream, "remoteStream remote ");
    if (remoteStream && remoteStream?.getTracks().length > 0) {
      otherPeerStremeRef.current.srcObject = remoteStream;
    }
    return () => {};
  }, [remoteStream]);

  // console.log(callReceive, "callReceive");
  return (
    <div className="flex flex-col gap-5">
      {
        // callReceive.offer === "" && callReceive.caller === "" &&
        <div className="flex gap-x-4 text-sm  ">
          <button
            onClick={() => {
              handelCallStart({ callType: "AUDIO" });
              handleOpenMedia({ audio: true });
            }}
            className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
          >
            Audio
          </button>
          <button
            onClick={() => {
              handelCallStart({ callType: "VIDEO" });
              handleOpenMedia({ video: true });
            }}
            className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
          >
            Video
          </button>
          <button
            onClick={async () => {
              await userMediaIntance?.closeAllStreams();
              setStreamTitle("No Stream Selected");
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
                  onClick={async () => {
                    const offer = JSON.parse(callReceive.offer);
                    const answer =
                      await webRTCServiceInstance.createAnswer(offer);
                    const stringifiedAnswer = JSON.stringify(answer);
                    answerCall({
                      answer: stringifiedAnswer,
                      status: true,
                      caller: callReceive.caller,
                    });
                    setCallAnswerStatus("Answered");

                    console.log("call accepted", callReceive.callType);
                    if (callReceive.callType === "AUDIO") {
                      setStreamTitle("Audio");
                     await handleOpenMedia({ audio: true });
                    }
                    if (callReceive.callType === "VIDEO") {
                      setStreamTitle("Video");
                      await handleOpenMedia({ video: true });
                    }
                    sendStreams();
                  }}
                  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
                >
                  Accept Call
                </button>
                {/* <button
                  onClick={async () => {
                    answerCall({
                      answer: "",
                      status: false,
                      caller: callReceive.caller,
                    });
                    setCallAnswerStatus("Rejected");
                    console.log("call rejected");
                  }}
                  className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
                >
                  Reject Call
                </button> */}
              </div>
            )}
          </div>
        )}
        <div>
          {callAnswerResponse.answer !== "" && (
            <div>
              <h1>
                {callAnswerResponse.caller} responde{" "}
                {JSON.stringify(callAnswerResponse.status)}
              </h1>
            </div>
          )}
        </div>
        {callAnswerStatus === "Answered" &&
          streamTitle === "No Stream Selected" && (
            <div>
              <h1>Peer {callAnswerStatus}</h1>
              <div>
                <audio
                  ref={otherPeerStremeRef}
                  autoPlay
                  playsInline
                  controls={true}
                  className={` ${callReceive.callType === "AUDIO" ? "block" : "hidden"}`}
                />
                <video
                  ref={otherPeerStremeRef}
                  autoPlay
                  playsInline
                  controls={true}
                  className={` ${callReceive.callType === "VIDEO" ? "block" : "hidden"}`}
                />
              </div>
            </div>
          )}
      </div>

      <div>
        <h1> your {streamTitle}</h1>
        <div>
          <audio
            ref={stremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "Audio" ? "block" : "hidden"}`}
          />
          <video
            ref={stremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "Video" ? "block" : "hidden"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Calls;
