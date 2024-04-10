"use client";
import CallsTest from "@/components/webrtc/CallsText";
import {  useSocket } from "@/context/socketProvider";
import { IMessageType } from "@/context/type";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Page: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage, messages, roomMembers, callReceive } = useSocket();
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [receiver, setReceiver] = useState("");
  const [allMessages, setAllMessages] = useState<IMessageType[]>([]);

  useEffect(() => {
    // Scroll to the bottom of the div when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (messages) setAllMessages((prev) => [...prev, messages]);
  }, [messages]);
  const router = useRouter();
  useEffect(() => {
    const roomName = sessionStorage.getItem("room_name");
    const userName = sessionStorage.getItem("user_name");
    if (!roomName || !userName) {
      router.push("/");
    }
    if (roomName && userName) {
      setRoomName(roomName);
      setUserName(userName);
    }
  }, []);

  // console.log("allMessages : ", allMessages ,"messages : " , messages)
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    const data = {
      message: inputValue,
      user: userName,
      room: roomName,
    };
    sendMessage(data);
    setAllMessages((prev) => [...prev, data]);
    e.target[0].value = "";
  };

  // console.log(roomMembers.length, "roomMembers.length");
  return (
    <div className="h-screen p-10  ">
      <div className=" relative container max-h-[90%] h-full border-4 border-gray-300 rounded-3xl px-[2.5%] pb-20  py-5 ">
        <div className="flex flex-col gap-y-5 overflow-y-scroll h-full ">
        <h1 className="text-4xl font-bold ">
              {roomName} ({userName})
            </h1>
          <div className="flex flex-col ">
            Other users:
            <div>
              {roomMembers?.length > 1 ? (
                <div className="flex items-center text-2xl flex-wrap gap-3">
                  <p>select user to call : </p>
                  <select
                    defaultValue={""}
                    onChange={(e) => setReceiver(e.currentTarget.value)}
                    name="receiver"
                    id="receiver"
                    className="bg-slate-800 text-slate-300  text-2xl px-5 py-1 rounded-xl "
                  >
                    <option className="!text-[10px]" value="">
                      Select One
                    </option>
                    {roomMembers?.map(
                      (user, id) =>
                        user !== userName && (
                          <option key={id} value={user}>
                            {user}
                          </option>
                        )
                    )}
                  </select>
                </div>
              ) : (
                <p>No one in Room</p>
              )}
            </div>
          </div>

          <div className=" w-full pr-[10%]  font-bold text-2xl text-gray-300  gap-5 flex flex-col gap-y-6  ">
           
            {roomMembers?.length > 1 &&
              (receiver !== "" ||
                (callReceive.offer !== null && callReceive.caller !== "")) && (
                <CallsTest caller={userName} receiver={receiver} />
              )}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="absolute bottom-20  w-[90%]  overflow-y-scroll flex flex-col"
        >
          {allMessages?.map((message, id) => (
            <div
              key={id}
              className={` ${message?.user === userName ? "justify-end" : "justify-start"} flex gap-x-2 items-center`}
            >
              <div className="  bg-gray-800  px-2 py-1 rounded-lg ">
                {" "}
                {message?.user} :{" "}
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <p className="text-gray-200 font-medium">{message?.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="absolute bottom-5 flex gap-x-2 items-center  w-full "
        >
          <input
            type="text"
            className="border-2 border-gray-400 w-[70%] lg:w-[83%] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
          />
          <button
            type="submit"
            className="border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-700 hover:text-blue-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
