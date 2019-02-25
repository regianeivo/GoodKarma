import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";

@Entity()
export class Karma {
    @PrimaryGeneratedColumn()
    public id!: number;
    @ManyToOne(type => User, user => user.karma)
    @JoinColumn({name: "userId"})
    user: User;
    @ManyToOne(type => Comment, comment => comment.karma)
    @JoinColumn({name: "commentId"})
    comment: Comment;
}
