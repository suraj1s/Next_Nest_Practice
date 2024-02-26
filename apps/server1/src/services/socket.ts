import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket service...");
    this._io = new Server({
      // connectionStateRecovery : {},
        cors : {
            allowedHeaders : ["*"],
            origin : "http://localhost:3000",
            // methods : ["GET", "POST"]
        }
    });
  }

  public initListeners() {
    const io = this._io;
    console.log("initiliazing socket listeners...")
    io.on("connect", (socket) => {
      console.log("a new socket connected", socket.id);
      socket.on("join:room" , (room : string) => {
        const rooms = io.sockets.adapter.rooms;

        if (!rooms.has(room)) {
          // Room doesn't exist, so you can join it
          socket.join(room);
          console.log(`Joined room: ${room}`);
        } else {
          console.log(`Room ${room} already exists`);
          // Handle the case when the room already exists
        }
      })
      socket.on("client:message",  ({message } : {message : {
        message : string,
        room : string,
        user : string
      } }) => {

        const rooms = io.sockets.adapter.rooms;

          // Room doesn't exist, so you can join it
          socket.join(message.room);
         
        console.log("new message recieved ", message);
        // io.emit("server:message",  message );
        // io.in(message.room).emit("server:message", message)
        socket.to(message.room).emit("server:message",  message );
      })
      socket.on("disconnect", () => {
        console.log("user disconnected msg:form server");
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
