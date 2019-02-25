import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";

export function getAuthController() {

    const AUTH_SECRET = process.env.AUTH_SECRET;
    const userRepository = getUserRepository();
    const router = express.Router();

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };

    // HTTP POST http://localhost:8080/auth/login/
    router.post("/login", (req, res) => {
        (async () => {
            const userDetails = req.body;
            const result = joi.validate(userDetails, userDetailsSchema);
            if (result.error) {
                res.status(400).send();
            } else {
                const match = await userRepository.findOne(userDetails);
                if (match === undefined) {
                    res.status(401).send('user not authorized');
                } else {
                    if (AUTH_SECRET === undefined) {
                        console.log(AUTH_SECRET);
                        res.status(500).send();
                    } else {
                        const token = jwt.sign({ id: match.id }, AUTH_SECRET);
                        res.json({ token: token }).send();
                    }
                }
            }
        })();
    });

    return router;
}