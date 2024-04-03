"use client";

import { userMediaIntance } from "@/services/userMedia";
import React, { useEffect, useRef, useState } from "react";

const Calls = () => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const stremeRef = useRef<any>(null);
  useEffect(() => {
    if (userMediaIntance) {
      console.log(userMediaIntance.getMediaStream(), " userMediaIntance");

      if (streamTitle === "Audio") {
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
      if (streamTitle === "Video") {
        stremeRef.current.srcObject =
          userMediaIntance.mediaInstance
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
          setStreamTitle("Video");
        }
        if (audio) {
          console.log(audio, " audio");
          await userMediaIntance?.openAudioStream();
          setStreamTitle("Audio");
        }
      }
    } catch (error) {
      console.error("Error opening media stream:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto py-20">
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={() => handleOpenMedia({ audio: true })}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
        >
          Audio
        </button>
        <button
          onClick={() => handleOpenMedia({ video: true })}
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





