// @ts-ignore
import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  private usersInRooms: any;
  private userToSocket: any;
  private socketToUser: any;
  constructor() {
    console.log("init socket service...");
    this._io = new Server({
      // connectionStateRecovery : {},
      cors: {
        allowedHeaders: ["*"],
        origin: "http://localhost:3000",
        // methods : ["GET", "POST"]
      },
    });
    this.usersInRooms = {};
    this.userToSocket = new Map();
    this.socketToUser = new Map();
  }

  public initListeners() {
    const io = this._io;
    console.log("initiliazing socket listeners...");
    io.on("connect", (socket: any) => {
      console.log("a new socket connected", socket.id);

      socket.on(
        "room:join",
        ({ room, user }: { room: string; user: string }) => {
          const rooms = io.sockets.adapter.rooms;
          console.log(`Joined room: ${room}`);
          if (!rooms.has(room)) {
            // Room doesn't exist, so you can join it
            socket.join(room);
          } else {
            console.log(`Room ${room} already exists`);
            // Handle the case when the room already exists
          }

          if (!this.usersInRooms[room]) {
            this.usersInRooms[room] = [];
          }
          this.usersInRooms[room].push(socket.id);
          this.userToSocket.set(user, socket.id);
          this.socketToUser.set(socket.id, user);
          console.log(this.usersInRooms , "users in room")
          const roomUsers = this.usersInRooms[room]
          let roomUsersName = []
          if(roomUsers){
            roomUsersName = roomUsers.map((socketId: string) =>
            this.socketToUser.get(socketId)
          );
          }
          socket.to(room).emit("room:userJoined", {
            users: roomUsersName,
          });
        }
      );

      socket.on("getUsersInRoom", (room: string) => {
        const users = this.usersInRooms[room] || [];
        io.to(room).emit("usersInRoom", users);
      });

      socket.on(
        "client:message",
        ({
          message,
        }: {
          message: {
            message: string;
            room: string;
            user: string;
          };
        }) => {
          socket.join(message.room);
          console.log("new message recieved ", message);
          // io.emit("server:message",  message );
          // io.in(message.room).emit("server:message", message)
          socket.to(message.room).emit("server:message", message);
          console.log(this.usersInRooms[message.room] , "users in room")
          const roomUsers = this.usersInRooms[message.room]
          let roomUsersName = []
          if(roomUsers){
            roomUsersName = roomUsers.map((socketId: string) =>
            this.socketToUser.get(socketId)
          );
          }
          socket.to(message.room).emit("room:userJoined", {
            users: roomUsersName,
          });
        }
      );

      socket.on("call:start", (data: any) => {
        console.log("call:start", data);
        socket.to(data.room).emit("call:revieve", data);
      });

      socket.on("call:answer", (data: any) => {
        console.log("call:answer", data);
        socket.to(data.room).emit("call:callResponse", data);
      });

      socket.on("call:reject", (data: any) => {
        console.log("call:reject", data);
        socket.to(data.room).emit("call:callResponse", data);
      });

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
