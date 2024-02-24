import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket service...");
    this._io = new Server({
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
      socket.on("client:message", async ({message } : {message : string }) => {
        console.log("new message recieved ", message);
        socket.emit("server:message",  message );
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
