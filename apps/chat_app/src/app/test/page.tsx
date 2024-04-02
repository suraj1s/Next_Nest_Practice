"use client";

import UserMedia from "@/services/userMedia";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [currentStream, setCurrentStream] = useState<typeof UserMedia>();
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");

  const stremeRef = useRef<any>(null);

  console.log(currentStream?.getMediaStream(), " currentStream");
  // useEffect(() => {
  //   if (currentStream) {
  //     if (streamTitle === "Audio") {
  //       stremeRef.current.srcObject =
  //         currentStream.mediaInstance?.getAudioTracks()[0];
  //     }
  //     if (streamTitle === "Video") {
  //       stremeRef.current.srcObject =
  //         currentStream.mediaInstance?.getVideoTracks()[0];
  //     }
  //   }
  // }, [currentStream]);

  const handleOpenMedia = async ({
    video,
    audio,
  }: {
    video?: boolean;
    audio?: boolean;
  }) => {
    try {
      console.log("first");
      if (currentStream) {
        if (video) {
          console.log(video, " video");
          currentStream?.openVideoStream();
          setStreamTitle("Video");
        }
        if (audio) {
          console.log(audio, " audio");
          currentStream?.openAudioStream();
          setStreamTitle("Audio");
        }
      }
      console.log("last");
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
          onClick={() => {
            currentStream?.closeAllStreams();
            setStreamTitle("No Stream Selected");
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Close Media{" "}
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

export default Page;
