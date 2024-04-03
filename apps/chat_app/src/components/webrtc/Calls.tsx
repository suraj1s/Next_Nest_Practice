"use client";

import React, { useEffect } from "react";
import { userMediaIntance } from "@/services/userMedia";

interface CallsProps {
  stremeRef: any;
  streamTitle: string;
  setStreamTitle: (val: string) => void;
  isAudio: boolean;
  isVideo: boolean;
  isCloseAll: boolean;
}

const Calls = ({
  stremeRef,
  streamTitle,
  setStreamTitle,
  isAudio,
  isVideo,
  isCloseAll,
}: CallsProps) => {
  useEffect(() => {
    if (userMediaIntance) {
      if (streamTitle === "Audio") {
        stremeRef.current.srcObject =
          userMediaIntance.mediaInstance?.getAudioTracks()[0];
      }
      if (streamTitle === "Video") {
        stremeRef.current.srcObject =
          userMediaIntance.mediaInstance?.getVideoTracks()[0];
      }
    }
  }, [userMediaIntance]);

  const handleOpenMedia = async ({
    video,
    audio,
  }: {
    video?: boolean;
    audio?: boolean;
  }) => {
    try {
      console.log("first");
      if (userMediaIntance) {
        if (video) {
          console.log(video, " video");
          userMediaIntance?.openVideoStream();
          setStreamTitle("Video");
        }
        if (audio) {
          console.log(audio, " audio");
          userMediaIntance?.openAudioStream();
          setStreamTitle("Audio");
        }
      }
      console.log("last");
    } catch (error) {
      console.error("Error opening media stream:", error);
    }
  };

  return (
    <div>
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
