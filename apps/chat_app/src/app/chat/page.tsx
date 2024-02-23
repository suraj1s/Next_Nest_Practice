"use client"

import React, { useEffect, useState , useRef } from "react";

const Page: React.FC = () => {
  const dummyMessage = [
    {
      id: 1,
      user: "user1",
      message: "Hello",
    },
    {
      id: 2,
      user: "user2",
      message: "Hi",
    },
    {
      id: 3,
      user: "user1",
      message: "How are you?",
    },
    {
      id: 4,
      user: "user2",
      message: "I am good",
    },
  ];

  const [messages, setMessages] = useState(dummyMessage)
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll to the bottom of the div when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    const user = messages.length % 2 === 0 ? "user1" : "user2";
    setMessages([...messages, { id: messages.length + 1 , user: user, message: inputValue }]);
    e.target[0].value = "";
  };
  
  return (
    <div className="h-screen">
      <div>Contacts</div>
      <div className="relative container max-h-[90%] h-full border-4 border-gray-300 rounded-3xl px-10 pt-16 pb-20 max-w-[55%] ">
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
              className={`${message.user === "user1" ? "justify-end" : "justify-start"} flex gap-x-2 items-center`}
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
            className="border-2 border-gray-400 w-[83%] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
            
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
