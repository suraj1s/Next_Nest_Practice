"use client";

import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [currentStream, setCurrentStream] = useState<MediaStream>();
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const openMediaDevices = async (constraints: any) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  const stremeRef = useRef<any>(null);

  const closeAllStreams = () => {
    console.log("close all streams");
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      setCurrentStream(undefined);
      setStreamTitle("No Stream Selected");
    }
  };

  useEffect(() => {
    if (stremeRef.current && currentStream) {
      if (currentStream.getVideoTracks().length > 0) {
        setStreamTitle("Video");
        stremeRef.current.srcObject = currentStream;
      }
      if (
        currentStream.getAudioTracks().length > 0 &&
        currentStream.getVideoTracks().length === 0
      ) {
        setStreamTitle("Audio");
        stremeRef.current.srcObject = currentStream;
      }
    }
  }, [currentStream]);

  const handleOpenMedia = async ({
    video,
    audio,
  }: {
    video: boolean;
    audio: boolean;
  }) => {
    try {
      // Check if a new stream is requested or existing stream needs modification
      if (
        (video && !currentStream?.getVideoTracks().length) ||
        (audio && !currentStream?.getAudioTracks().length)
      ) {
        // Open a new stream with requested constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          video: video,
          audio: audio,
        });
        setCurrentStream(stream);
      } else if (video && currentStream) {
        // Handle adding a video track to an existing stream
        if (!currentStream.getVideoTracks().length) {
          const newVideoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          const newVideoTrack = newVideoStream.getVideoTracks()[0];
          currentStream.addTrack(newVideoTrack);
          newVideoStream.getTracks().forEach((track) => track.stop()); // Release resources of new stream
        } else {
          console.warn(
            "Video stream already active. Ignoring duplicate request."
          );
        }
      } else if (audio && currentStream) {
        // Handle adding an audio track to an existing stream
        if (!currentStream.getAudioTracks().length) {
          const newAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const newAudioTrack = newAudioStream.getAudioTracks()[0];
          currentStream.addTrack(newAudioTrack);
          newAudioStream.getTracks().forEach((track) => track.stop()); // Release resources of new stream
        } else {
          console.warn(
            "Audio stream already active. Ignoring duplicate request."
          );
        }
      } else if (currentStream) {
        // Handle removing tracks if no video or audio is requested
        if (!video && !audio) {
          currentStream.getTracks().forEach((track) => track.stop());
          setCurrentStream(undefined);
        } else {
          // Handle cases where user might want to switch between video/audio within the same stream
          const existingTracks = currentStream.getTracks();
          if (video && !audio) {
            existingTracks.forEach((track) => {
              if (track.kind === "audio") {
                currentStream.removeTrack(track);
                track.stop();
              }
            });
          } else if (audio && !video) {
            existingTracks.forEach((track) => {
              if (track.kind === "video") {
                currentStream.removeTrack(track);
                track.stop();
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  console.log(
    currentStream?.getTracks().map((item) => item),
    "currentStream"
  );
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto py-20">
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={() => handleOpenMedia({ video: false, audio: true })}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
        >
          Audio
        </button>
        <button
          onClick={() => handleOpenMedia({ video: true, audio: true })}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Video
        </button>
        <button
          onClick={() => closeAllStreams()}
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
            className={`${streamTitle === "Audio"? "block" : "hidden"}`}
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
