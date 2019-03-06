import * as express from "express";
import * as joi from "joi";
import { authMiddleware } from "../config/middleware";
import { getReplyRepository } from "../repositories/reply_repository";
import { getKarmaRepository } from "../repositories/karma_repository";
import { Reply } from "../entities/reply";
import { Repository } from "typeorm";

export function getHandlers(replyRepo: Repository<Reply>) {

    const getReplyByIDHandler = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const reply = await replyRepo.findOne(id);
            res.json(reply);
        })();
    };

    return {
        getReplyByIDHandler: getReplyByIDHandler
    }; 
}

export function getReplyController() {

    // Create respository so we can perform database operations
    const replyRepository = getReplyRepository();
    const karmaRepository = getKarmaRepository();

    // Create handlers
    const handlers = getHandlers(replyRepository);

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Declare Joi Schema so we can validate movies
    const replySchemaForPost = {
        text: joi.string(),
        link: joi.number(),
    };

    

    // HTTP POST http://localhost:8080/replies/
    router.post("/", authMiddleware, (req, res) => {
        (async () => {
            const newReply = req.body;
            const userId = (req as any).userId;
            const result = joi.validate(newReply, replySchemaForPost);
            if (result.error) {
                res.status(400).send({ msg: "Reply is not valid! You must pass a text and the link id" });
            } else {
                const data = {
                    text: req.body.text,
                    user: userId,
                    link: req.body.link,
                    date: Date()
                };
                const replies = await replyRepository.save(data);
                res.json(replies);
            }
        })();
    });


    
    //HTTP PATCH http://localhost:8080/replies/1
    router.patch("/:replyId", authMiddleware,(req, res) => {
        (async () => {
            const replyId = req.params.commentId;
            const update = req.body;
            const userId = (req as any).userId;
            const matchUser = await replyRepository.findOne(replyId,{relations: ['user']});
            if(matchUser === undefined){
                res.status(404).send();
            }else if(matchUser.user.id !== userId){
                res.status(401).send('user unathorized');
            }else{
                const oldReply = await replyRepository.findOne(replyId);
                if (oldReply) {
                    const key = Object.keys(update)[0];
                    const val = update[key];
                    (oldReply as any)[key] = val;
                    const updatedReply = await replyRepository.save(oldReply);
                    res.json(updatedReply);
                } else {
                res.status(404).send();
            }
        }
        })();
     });
     
    // HTTP DELETE http://localhost:8080/replies/1
    router.delete("/:id", authMiddleware, (req, res) => {
        (async () => {
            const userId = (req as any).userId;
            const id = req.params.id;
            const matchUser = await replyRepository.findOne(id,{relations: ['user']});
            if(matchUser === undefined){
                res.status(404).send();
            }else if(matchUser.user.id !== userId){
                res.status(401).send('user unauthorized');
            }else{
                const links = await replyRepository.delete(id);
                res.json({ ok :'reply deleted!' }).send();
            }
        })();
    });

    // HTTP POST KARMAVOTE http://localhost:8080/replies/1/karmavote
    router.post("/:id/karmavote", authMiddleware, (req, res) => {
        (async () => {
            const userId = (req as any).userId;
            const replyId = req.params.id;
            // get the owner of the reply to receive the karma point
            const getUser = await replyRepository.findOne(replyId, {relations: ['user']});
            let owner = undefined;
            if(getUser != undefined){
                owner = getUser.user.id;
            }
            const data = {
                user: userId,// owner is the user who owns the reply
                reply: replyId,
            };

            //block is provisional taken from the block bellow for test
            //const karma = await karmaRepository.save(data);
            //res.json(karma);
            

            // block bellow prevent the user to vote the same comment twice
            // not sure if its needed in karma case

            /*const allowKRate = await karmaRepository.findOne({user: userId, comment: commentId});
            if(allowKRate === undefined){
                const karma = await karmaRepository.save(data);
                res.json(karma);
            }else if(allowKRate){
                //user not authorized to vote the same link twice
                res.status(401).send('user not authorized to vote the same comment twice');
            }*/
        })();
    });

    return router;
}