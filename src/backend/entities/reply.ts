import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";
import { Karma } from "./karma";
import { Comment } from "./comment";

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public text!: string;
    @Column()
    public date!: Date;
    @ManyToOne(type => User, user => user.reply)
    @JoinColumn({name: "userId"})
    user: User;
    @ManyToOne(type => Link, link => link.reply)
    @JoinColumn({name: "linkId"})
    link: Link;
    @OneToMany(type => Karma, karma => karma.reply)
    karma: Karma[];
    @OneToMany(type => Comment, comment => comment.reply)
    comment: Comment[];
}