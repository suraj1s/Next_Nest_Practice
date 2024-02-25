export default function Home() {
  const handelsubmit = (e: any) => {
    e.preventDefault();
    const room_name = e.target[0].value;
    const user_name = e.target[1].value;
    console.log(room_name, user_name);
    localStorage.setItem("room_name", room_name);
    localStorage.setItem("user_name", user_name);

  }
  return (
    <div className=" text-gray-200 font-semibold p-40 ">
      {/* <h1>Chat App</h1>
      <p>Chat with your friends</p> */}
      <form onSubmit={handelsubmit} className="flex flex-col gap-y-4 text-lg">
        <div className=" flex flex-col gap-y-2 ">
          <label htmlFor="room_name"> plese enter a room name to join </label>
          <input
            type="text"
            required={true}
            className="border-2 border-gray-400 w-[20%]  rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="user_name"> plese enter your name to join </label>
          <input
            type="text"
            required={true}
            className="border-2 border-gray-400 w-[20%] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3"
          />
        </div>
      </form>
    </div>
  );
}
