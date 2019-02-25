import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";
import { Karma } from "./karma";

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
    @ManyToOne(type => Link, link => link.comment)
    @JoinColumn({name: "linkId"})
    link: Link;
    @OneToMany(type => Karma, karma => karma.comment)
    karma: Karma[];
}