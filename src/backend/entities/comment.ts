import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public text!: string;
    @Column()
    public date!: Date;
    @ManyToOne(type => User, user => user.comment)
    @JoinColumn({name: "userId"})
    user: User;
    @ManyToOne(type => Reply, reply => reply.comment)
    @JoinColumn({name: "replyId"})
    reply: Reply;
}