import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    firstName: string

    @Column({
        length: 100,
    })
    lastName: string
    
    @Column("int")
    age: number
   
    @Column("boolean")
    isAuthor: boolean

    @Column("boolean")
    isAdmin: boolean

    constructor() {
        this.id = 0; // Or initialize with an appropriate default value
        this.firstName = "";
        this.lastName = "";
        this.age = 10;
        this.isAdmin = false;
        this.isAuthor = false;
    }
}


