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
        console.log("joining room ", room);
        socket.join(room);
      })
      socket.on("client:message",  ({message } : {message : {
        message : string,
        room : string,
        user : string
      } }) => {
        console.log("new message recieved ", message);
        // io.emit("server:message",  message );
        io.in(message.room).emit("server:message", message)
        // socket.to(message.room).emit("server:message",  message );
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
