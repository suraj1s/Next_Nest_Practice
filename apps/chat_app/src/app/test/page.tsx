"use client";

import { userMediaIntance } from "@/services/userMedia";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
  const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
  const stremeRef = useRef<any>(null);
  useEffect(() => {
    if (userMediaIntance) {
      console.log(userMediaIntance.getMediaStream(), " userMediaIntance");

      if (streamTitle === "Audio") {
        // navigator.mediaDevices
        //   .getUserMedia({
        //     audio: true,
        //   })
        //   .then((a) => {
        //     console.log(a, "hello");
        //     stremeRef.current.srcObject = a;
        //   });
        console.log(
          userMediaIntance.mediaInstance,
          "media instance auto track"
        );
        stremeRef.current.srcObject = userMediaIntance.mediaInstance;
      }
      if (streamTitle === "Video") {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: true,
          })
          .then((a) => {
            console.log(a.getTracks(), "hello");
            // stremeRef.current.srcObject = a;
          });
        console.log(userMediaIntance.mediaInstance?.getTracks() , "video inbsstans ");
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

export default Page;

// "use client";

// import Calls from "@/components/webrtc/Calls";
// import { userMediaIntance } from "@/services/userMedia";
// import React, { useEffect, useRef, useState } from "react";

// const Page = () => {
//   // const [newCameraList, setNewCameraList] = useState<MediaDeviceInfo[]>([]);
//   const [currentStream, setCurrentStream] = useState<typeof userMediaIntance>();
//   const [streamTitle, setStreamTitle] = useState<string>("No Stream Selected");
//   const [isAudio, setIsAudio] = useState<boolean>(false);
//   const [isVideo, setIsVideo] = useState<boolean>(false);
//   const [isCloseAll, setIsCloseAll] = useState<boolean>(false);

//   const stremeRef = useRef<any>(null);
//   // let media = navigator.mediaDevices.getUserMedia({})
//   // console.log(media, " media")
//   // console.log(userMediaIntance?.getMediaStream(), " userMediaIntance");

//   return (
//     <div className="flex flex-col gap-5 max-w-3xl mx-auto py-20">
//       <div className="flex gap-x-4 text-sm  ">
//         <button
//           onClick={() => setIsAudio(true)}
//           className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
//         >
//           Audio
//         </button>
//         <button
//           onClick={() => setIsVideo(true)}
//           className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
//         >
//           Video
//         </button>
//         <button
//           onClick={() => {
//             setIsCloseAll(true);
//             setStreamTitle("No Stream Selected");
//           }}
//           className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400 "
//         >
//           Close Media
//         </button>
//       </div>
//       <Calls
//         setStreamTitle={setStreamTitle}
//         streamTitle={streamTitle}
//         stremeRef={stremeRef}
//         isAudio={isAudio}
//         isVideo={isVideo}
//         isCloseAll={isCloseAll}
//       />
//     </div>
//   );
// };

// export default Page;
