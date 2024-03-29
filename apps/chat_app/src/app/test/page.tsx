"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [newCameraList, setNewCameraList] = useState<any>([]);
  const openMediaDevices = async (constraints: any) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  async function getConnectedDevices(type: any) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  }
  useEffect(() => {
    getConnectedDevices("videoinput").then((videoCameras) => {
      console.log("Cameras found:", videoCameras);
      setNewCameraList(videoCameras);
    });
  }, []);

  console.log(newCameraList, "newCameraList");

  // Listen for changes to media devices and update the list accordingly
  //   navigator.mediaDevices.addEventListener("devicechange", async (event) => {
  //     const newCameraList = await getConnectedDevices("video");
  //     setNewCameraList(newCameraList);
  //   });

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto py-20">
      <div className="flex gap-x-4 text-sm  ">
        <button
          onClick={async () => {
            try {
              const stream = await openMediaDevices({
                video: false,
                audio: true,
              });
              console.log("Got MediaStream:", stream);
            } catch (error) {
              console.error("Error accessing media devices.", error);
            }
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
        >
          Audio{" "}
        </button>
        <button
          onClick={async () => {
            try {
              const stream = await openMediaDevices({
                video: true,
                audio: true,
              });
              console.log("Got MediaStream:", stream);
            } catch (error) {
              console.error("Error accessing media devices.", error);
            }
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Video{" "}
        </button>
        <button
          onClick={async () => {
            
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Close Media{" "}
        </button>
      
        <button
          onClick={async () => {
            const videoCameras = await getConnectedDevices("videoinput");
            console.log("Cameras found:", videoCameras);
          }}
          className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
        >
          Get Connected divices
        </button>
      </div>
      <div>
        <h1>active medias</h1>
        <div>
          {newCameraList.map((camera: any, index: number) => {
            return (
              <div key={index} className="flex gap-3">
                <p>{index + 1} </p>
                <div>
                  <p>{camera.label}</p>
                  <p>{camera.deviceId}</p>
                  <p>{camera.kind}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
