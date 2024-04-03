import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Message } from "./Message";
import { BaseModel } from "./BaseModel";
import { Group } from "./Group";

@Entity()
export class User extends BaseModel {
  @Column({ length: 100, unique: true })
  userName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  profilePicture: string; // URL or path

  @OneToMany(() => Message, (message) => message.sender)
  messagesSent: Message[];

  

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable({
    name: "user_groups",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "groupId", referencedColumnName: "id" },
  })
  groups: Group[];

  // Placeholders for audio/video call functionality
  callStatus: string; // "available", "in_call", etc.
  callHistory: []; // Array of call objects

    constructor() {
        super();
        this.userName = "";
        this.email = "";
        this.profilePicture = "";
        this.messagesSent = [];
        this.groups = [];
        this.callStatus = "available";
        this.callHistory = [];
    }
}




