"use client"

import { useSocket } from "@/context/socketProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { createRoom } = useSocket();
  const handelsubmit = (e: any) => {
    e.preventDefault();
    console.log(e.target[0].value, e.target[1].value)
    const room_name = e.target[0].value;
    const user_name = e.target[1].value;
    createRoom(room_name);
    sessionStorage.setItem("room_name", room_name);
    sessionStorage.setItem("user_name", user_name);
    router.push("/chat");
  }
  return (
    <div className=" text-gray-200 font-semibold p-40 ">
      {/* <h1>Chat App</h1>
      <p>Chat with your friends</p> */}
      <form onSubmit={handelsubmit} className="flex flex-col gap-y-4 text-lg ">
        <div className=" flex flex-col gap-y-2 ">
          <label htmlFor="room_name"> plese enter a room name to join </label>
          <input
            type="text"
            required={true}
            id="room_name"
            className="border-2 border-gray-400 w-[20%]  rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="user_name"> plese enter your name to join </label>
          <input
            type="text"
            required={true}
            id="user_name"
            className="border-2 border-gray-400 w-[20%] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-800 w-[100px] flex items-center justify-center py-3 rounded-lg h-10 text-gray-200 font-medium  outline-slate-800" >
            Join
          </button>
      </form>
    </div>
  );
}
