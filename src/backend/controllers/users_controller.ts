import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import * as joi from "joi";
import { Repository } from "typeorm";
import { link } from "fs";


export function getUserController() {

    const userRepository = getUserRepository();
    const router = express.Router();

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };


    // HTTP GET http://localhost:8080/users/1
    router.get("/:id", (req, res) => {
        (async () => {
            const id = req.params.id;
            const user = await userRepository.findOne(id, {relations: ['link', 'comment']});
            if (user === undefined){
                res.status(404).send('user not found');
            }else{
                res.json(user);
            }
        })();
    });

    // HTTP POST http://localhost:8080/users/
    router.post("/", (req, res) => {
        (async () => {
            const newUser = req.body;
            const result = joi.validate(newUser, userDetailsSchema);
            const allowUser = await userRepository.findOne({email: newUser.email});
            if (result.error) {
                res.status(400).send('please, try again');
            } else if(allowUser){
                res.status(400).send('ERROR, e-mail already exists!');
            }else{
                const user = await userRepository.save(newUser);
                res.json({ ok :'user created successfully!' }).send();
            }
        })();
    });

    return router;
}