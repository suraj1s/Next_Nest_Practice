"use client";

import React from "react";

const WebRTC = () => {
  return (
    <div className="flex gap-5 text-sm font-normal">
      <button className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400">
        Audio
      </button>
      <button className="border border-slate-300 rounded-md  px-3 py-1 hover:bg-slate-700 hover:text-blue-400">
        Video
      </button>
    </div>
  );
};

export default WebRTC;
