import { Server, Socket } from "socket.io";

class SocketService {
  private _io: Server;
  private usersInRooms: { [room: string]: string[] };
  private userToSocket: UserToSocketMap;
  private socketToUser: SocketToUserMap;

  constructor() {
    this._io = new Server({
      // connectionStateRecovery : {},
      cors: {
        allowedHeaders: ["*"],
        origin: "http://localhost:3000",
        // methods : ["GET", "POST"]
      },
    });
    this.usersInRooms = {};
    this.userToSocket = {};
    this.socketToUser = {};
  }

  public initListeners() {
    const io = this._io;

    io.on("connect", (socket: Socket) => {
      console.log("a new socket connected", socket.id);

      socket.on(
        "room:join",
        ({ room, user }: { room: string; user: string }) => {
          this.handleRoomJoin(socket, room, user);
        }
      );

      socket.on("getUsersInRoom", (room: string) => {
        this.handleGetUsersInRoom(socket, room);
      });

      socket.on("client:message", ({ message }: { message: any }) => {
        this.handleClientMessage(socket, message);
      });

      socket.on("call:start", (data: any) => {
        this.handleCallStart(socket, data);
      });

      socket.on("call:answer", (data: ICallAnswer) => {
        this.handleCallAnswer(socket, data);
      });
      
      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleRoomJoin(socket: Socket, room: string, user: string) {
    console.log(`User ${user} joining room ${room}`);

    // Join room
    socket.join(room);

    // Store user-room mapping
    if (!this.usersInRooms[room]) {
      this.usersInRooms[room] = [];
    }
    this.usersInRooms[room].push(user);
    this.userToSocket[user] = socket.id;
    this.socketToUser[socket.id] = user;

    // Emit event to inform other users in the room about the new user
    const roomUsers = this.usersInRooms[room];
    console.log(roomUsers, "roomUsers");
    // socket.to(room).emit("room:userJoined", { users: roomUsers });
    this._io.in(room).emit("room:userJoined", { users: roomUsers });

  }

  private handleGetUsersInRoom(socket: Socket, room: string) {
    console.log(`Request for users in room ${room}`);
    const users = this.usersInRooms[room] || [];
    socket.emit("usersInRoom", users);
  }

  private handleClientMessage(socket: Socket, message: any) {
    console.log("Received message:", message);
    // Broadcast message to everyone in the room except the sender
    socket.to(message.room).emit("server:message", message);
  }

  private handleCallStart(socket: Socket, {offer , caller , receiver, callType} : IStartCall ) {
    console.log("Starting call:", { "from": caller , "to": receiver , "with offer": offer, "callType": callType });
    // socket.to(data.room).emit("call:receive", data);
    const socketId = this.userToSocket[receiver];
    this._io.to(socketId).emit("call:receive", {offer , caller, callType });
  }

  private handleCallAnswer(socket: Socket, {answer , status, caller}: ICallAnswer) {
    console.log("Answering call:", answer , status, caller);
    console.log("caller " , caller );
    const receiver = this.socketToUser[socket.id];
    const callerSocketId = this.userToSocket[caller];
    this._io.to(callerSocketId).emit("call:answer", {answer , status, caller : receiver});
  }

  private handelRoomLeave(socket: Socket, room: string) {

  }
  private handleDisconnect(socket: Socket) {
    const disconnectedUser = this.socketToUser[socket.id];
    console.log(`User ${disconnectedUser} disconnected`);
    delete this.socketToUser[socket.id];
    const roomKeys = Object.keys(this.usersInRooms);
    for (const room of roomKeys) {
      if (this.usersInRooms[room].includes(disconnectedUser)) {
        this.usersInRooms[room] = this.usersInRooms[room].filter(
          (user: string) => user !== disconnectedUser
        );
        socket.to(room).emit("room:userLeft", { users: disconnectedUser });
      }
    }
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
