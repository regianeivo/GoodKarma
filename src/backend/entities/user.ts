import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";
import { Link } from "./link";
import { Comment } from "./comment";
import { Karma } from "./karma";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public email!: string;
    @Column()
    public password!: string;
    @OneToMany(type => Link, link => link.user)
    @JoinTable()
    link: Link[];
    @OneToMany(type => Comment, comment => comment.user)
    @JoinTable()
    comment: Comment[];
    @OneToMany(type => Karma, karma => karma.user)
    @JoinTable()
    karma: Karma[];
}
