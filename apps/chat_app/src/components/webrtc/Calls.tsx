"use client";

import { useSocket } from "@/context/socketProvider";
import { webRTCServiceInstance } from "@/services/useWebRTC";
import { userMediaIntance } from "@/services/userMedia";
import React, { useEffect, useRef, useState } from "react";

interface ICallsProps {
  caller: string;
  receiver: string;
}
const Calls = ({ caller, receiver }: ICallsProps) => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const stremeRef = useRef<any>(null);
  const otherPeerStremeRef = useRef<any>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const { startCall, callReceive } = useSocket();

  useEffect(() => {
    if (userMediaIntance) {
      // console.log(userMediaIntance.getMediaStream(), " userMediaIntance");
      if (streamTitle === "Audio") {
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
      if (streamTitle === "Video") {
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
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

  const handelCallStart = async () => {
    if (typeof window !== "undefined" && isClient) {
      try {
        const offer = await webRTCServiceInstance.createOffer();
        const stringifiedOffer = JSON.stringify(offer);
        startCall({ offer: stringifiedOffer, caller, receiver });
        console.log("offer", JSON.stringify(offer));
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };
console.log(callReceive, "callReceive")
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={() => {
            handelCallStart();
            // handleOpenMedia({ audio: true });
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
        >
          Audio
        </button>
        <button
          onClick={() => {
            handelCallStart();
            // handleOpenMedia({ video: true });
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
      <div>
        {callReceive.offer !== "" && callReceive.caller !== "" && (
          <div>
            <h1>{callReceive.caller} is calling you</h1>
            <div className="text-xs flex gap-4 py-3">
              <button
                onClick={async () => {
                  // const offer = JSON.parse(callReceive.offer);
                  // await webRTCServiceInstance.setAnswer(offer);
                  console.log("call accepted");
                }}
                className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
              >
                Accept Call
              </button>
              <button
                onClick={() => {
                  console.log("call rejected");
                }}
                className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
              >
                Reject Call
              </button>
            </div>
          </div>
        )}
        {/* <div>
          <audio
            ref={otherPeerStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "Audio" ? "block" : "hidden"}`}
          />
          <video
            ref={otherPeerStremeRef}
            autoPlay
            playsInline
            controls={true}
            className={`${streamTitle === "Video" ? "block" : "hidden"}`}
          />
        </div> */}
      </div>
      <div>
        <h1>{streamTitle}</h1>
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
