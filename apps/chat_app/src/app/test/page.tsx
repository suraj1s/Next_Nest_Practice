"use client";

import Calls from "@/components/webrtc/Calls";
import { userMediaIntance } from "@/services/userMedia";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [currentStream, setCurrentStream] = useState<typeof userMediaIntance>();
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const [isAudio, setIsAudio] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isCloseAll, setIsCloseAll] = useState<boolean>(false);

  const stremeRef = useRef<any>(null);
  // let media = navigator.mediaDevices.getUserMedia({})
  // console.log(media, " media")
  // console.log(userMediaIntance?.getMediaStream(), " userMediaIntance");

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto py-20">
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={() => setIsAudio(true)}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
        >
          Audio
        </button>
        <button
          onClick={() => setIsVideo(true)}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Video
        </button>
        <button
          onClick={() => {
            setIsCloseAll(true);
            setStreamTitle("No Stream Selected");
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Close Media
        </button>
      </div>
      <Calls
        setStreamTitle={setStreamTitle}
        streamTitle={streamTitle}
        stremeRef={stremeRef}
        isAudio={isAudio}
        isVideo={isVideo}
        isCloseAll={isCloseAll}
      />
    </div>
  );
};

export default Page;
