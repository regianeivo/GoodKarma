import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public question!: string;
    @Column()
    public title!: string;
    @Column()
    public field!: string; //Business or IT
    @Column()
    public date!: Date;
    @ManyToOne(type => User, user => user.link)
    @JoinColumn({name: "userId"})
    user: User;
    @OneToMany(type => Reply, reply => reply.link)
    reply: Reply[];
}
// edited tsconfig.json
//strictPropertyInitialization": false