import * as express from "express";
import { getLinkRepository } from "../repositories/link_repository";
import { authMiddleware } from "../config/middleware";
import * as joi from "joi";
import { Repository } from "typeorm";
import { Link } from "../entities/link";

export function getHandlers(linkRepo: Repository <Link>) {

    const linkDetailsSchema = {
        title: joi.string(),
        field: joi.string(),
        question: joi.string()
    };
    
    const postNewLink = (req: express.Request, res: express.Response) => {
        (async () => {
            const newLink = req.body;
            const userId = (req as any).userId;
            const result = joi.validate(newLink, linkDetailsSchema);
            if (result.error) {
                res.status(400).send();
            } else {
                const link = {
                    title: req.body.title,
                    field: req.body.field,
                    question: req.body.question,
                    date: Date(),
                    user: userId
                }
                const links = await linkRepo.save(link);
                res.json(links);
            }
        })();
    }; 
    return {
        postNewLink: postNewLink
    };
}


export function getLinkController() {

    const linkRepository = getLinkRepository();
    const router = express.Router();


    // Create handlers
    const handlers = getHandlers(linkRepository);


    // HTTP GET Links http://localhost:8080/links/
    router.get("/", (req, res) => {
        (async () => {
            const link = await linkRepository.find();
            res.json(link);
        })();
    });

    // HTTP GET Link by ID http://localhost:8080/links/1
    router.get("/:id", (req, res) => {
        (async () => {
            const id = req.params.id;
            const links = await linkRepository.findOne(id,{relations: ['comment']})
            if (links === undefined){
                res.status(404).send('link not found');
            }else{
                res.json(links);
            }
        })();
    });


    // HTTP POST http://localhost:8080/links/
    router.post("/", authMiddleware, handlers.postNewLink);


    // HTTP DELETE http://localhost:8080/links/1
    router.delete("/:id", authMiddleware, (req, res) => {
        (async () => {
            const userId = (req as any).userId;
            const id = req.params.id;
            const matchUser = await linkRepository.findOne(id,{relations: ['user']})
            if(matchUser === undefined){
                res.status(400).send();
            }else if(matchUser.user.id !== userId){
                res.status(401).send('unauthorized');
            }else{
                const links = await linkRepository.delete(id);
                res.json({ ok :'link deleted!' }).send();
            }
        })();
    });

    return router;
}