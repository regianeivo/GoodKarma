import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Karma {
    @PrimaryGeneratedColumn()
    public id!: number;
    @ManyToOne(type => User, user => user.karma)
    @JoinColumn({name: "userId"})
    user: User;
    @ManyToOne(type => Reply, reply => reply.karma)
    @JoinColumn({name: "replyId"})
    reply: Reply;
}
