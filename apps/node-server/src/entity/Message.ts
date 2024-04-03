import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { BaseModel } from "./BaseModel";

@Entity()
export class Message extends BaseModel {
  @Column({ length: 1000 })
  content: string;

  @Column({ type: "simple-json", nullable: true }) // For richer message types (optional)
  attachments: any;

  @ManyToOne(() => User, (user) => user.messagesSent)
  @JoinColumn({ name: "senderId", referencedColumnName: "id" })
  sender: User;

  @Column("int") // Replace with a Union type (User | Group) if needed
  receiverId: number;

  // Define a Union type for the receiver (optional, for improved type safety)
  receiver: User | Group;

  @ManyToOne(() => User, (user) => user.messagesReceived) // Optional for one-to-one
  @JoinColumn({ name: "receiverId", referencedColumnName: "id" })
  // We can keep the receiver as a User for one-to-one messages
  // to simplify the structure, but adjust if needed

  @ManyToOne(() => Group, (group) => group.groupMessages) // Optional for group messages
  @JoinColumn({ name: "receiverId", referencedColumnName: "id" })
  group: Group;

  // Placeholders for audio/video call metadata
  callType: string; // "text", "audio", "video"
  callDuration: number;

    constructor() {
        super();
        this.content = "";
        this.attachments = {};
        this.sender = new User();
        this.receiverId = 0;
        this.receiver = new User();
        this.group = new Group();
        this.callType = "text";
        this.callDuration = 0;
    }
}
