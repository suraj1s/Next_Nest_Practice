import { Entity, Column, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";
import { BaseModel } from "./BaseModel";

@Entity()
export class Group extends BaseModel {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  groupPicture: string; // URL or path

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({
    name: "user_groups",
    joinColumn: { name: "groupId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  members: User[];

  @OneToMany(() => Message, (message) => message.group)
  groupMessages: Message[];

    constructor() {
        super();
        this.name = "";
        this.description = "";
        this.groupPicture = "";
        this.members = [];
        this.groupMessages = [];
    }
}
