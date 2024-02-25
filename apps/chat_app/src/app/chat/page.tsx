"use client"
import { useSocket } from "@/context/socketProvider";
import React, { useEffect , useRef } from "react";

const Page: React.FC = () => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage, messages } = useSocket();

  useEffect(() => {
    // Scroll to the bottom of the div when messages change
    console.log(messages, "messages")
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSubmit = (e: any) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    sendMessage(inputValue);
    e.target[0].value = "";
  };
    
  return (
    <div className="h-screen  ">
      <div>Contacts</div>
      <div className="relative container max-h-[90%] h-full border-4 border-gray-300 rounded-3xl px-[2.5%] pt-16 pb-20 max-w-[55%] ">
        <h1 className="absolute top-5 font-bold text-2xl text-gray-300  ">
          Chat
        </h1>

        <div
          ref={scrollRef}
          className="absolute bottom-20  w-[90%]  overflow-y-scroll flex flex-col"
        >
          {messages.map((message, id) => (
            <div
              key={id}
              // ${message.user === "user1" ? "justify-end" : "justify-start"}
              className={` flex gap-x-2 items-center`}
            >
              <div className="size-5 bg-gray-300 rounded-full"></div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <p className="text-gray-200 font-medium">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

          <form onSubmit={(e) => handleSubmit(e)}className="absolute bottom-5 flex gap-x-2 items-center  w-full ">
          <input
            type="text"
            className="border-2 border-gray-400 w-[70%] lg:w-[83%] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
            
          />
          <button type="submit" className="px-2 py-1 bg-slate-900 border-2 border-gray-400 rounded-md">
            Send
          </button>
          </form>
        </div>
      </div>
  );
};

export default Page;
