import * as express from "express";
import * as joi from "joi";
import { authMiddleware } from "../config/middleware";
import { getCommentRepository } from "../repositories/comment_repository";
import { getKarmaRepository } from "../repositories/karma_repository";
import { Comment } from "../entities/comment";
import { Repository } from "typeorm";

export function getHandlers(commentRepo: Repository<Comment>) {

    const getCommentByIDHandler = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const comment = await commentRepo.findOne(id);
            res.json(comment);
        })();
    };

    return {
        getCommentByIDHandler: getCommentByIDHandler
    }; 
}

export function getCommentController() {

    // Create respository so we can perform database operations
    const commentRepository = getCommentRepository();
    const karmaRepository = getKarmaRepository();

    // Create handlers
    const handlers = getHandlers(commentRepository);

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Declare Joi Schema so we can validate movies
    const commentSchemaForPost = {
        text: joi.string(),
        link: joi.number(),
    };

    

    // HTTP POST http://localhost:8080/comments/
    router.post("/", authMiddleware, (req, res) => {
        (async () => {
            const newComment = req.body;
            const userId = (req as any).userId;
            const result = joi.validate(newComment, commentSchemaForPost);
            if (result.error) {
                res.status(400).send({ msg: "Comment is not valid! You must pass a text and the link id" });
            } else {
                const data = {
                    text: req.body.text,
                    user: userId,
                    link: req.body.link,
                    date: Date()
                };
                const comments = await commentRepository.save(data);
                res.json(comments);
            }
        })();
    });


    
    //HTTP PATCH http://localhost:8080/comments/1
    router.patch("/:commentId", authMiddleware,(req, res) => {
        (async () => {
            const commentId = req.params.commentId;
            const update = req.body;
            const userId = (req as any).userId;
            const matchUser = await commentRepository.findOne(commentId,{relations: ['user']});
            if(matchUser === undefined){
                res.status(404).send();
            }else if(matchUser.user.id !== userId){
                res.status(401).send('user unathorized');
            }else{
                const oldComment = await commentRepository.findOne(commentId);
                if (oldComment) {
                    const key = Object.keys(update)[0];
                    const val = update[key];
                    (oldComment as any)[key] = val;
                    const updatedComment = await commentRepository.save(oldComment);
                    res.json(updatedComment);
                } else {
                res.status(404).send();
            }
        }
        })();
     });
     
    // HTTP DELETE http://localhost:8080/comments/1
    router.delete("/:id", authMiddleware, (req, res) => {
        (async () => {
            const userId = (req as any).userId;
            const id = req.params.id;
            const matchUser = await commentRepository.findOne(id,{relations: ['user']});
            if(matchUser === undefined){
                res.status(404).send();
            }else if(matchUser.user.id !== userId){
                res.status(401).send('user unauthorized');
            }else{
                const links = await commentRepository.delete(id);
                res.json({ ok :'comment deleted!' }).send();
            }
        })();
    });

    // HTTP POST KARMAVOTE http://localhost:8080/comments/1/karmavote
    router.post("/:id/karmavote", authMiddleware, (req, res) => {
        (async () => {
            const userId = (req as any).userId;
            const commentId = req.params.id;
            // get the owner of the comment to receive the karma point
            const getUser = await commentRepository.findOne(commentId, {relations: ['user']});
            var owner = undefined;
            if(getUser != undefined){
                owner = getUser.user.id;
            }
            const data = {
                user: owner,// userId is the user who votes
                comment: commentId,
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