import express from "express"
import Thread from "../models/threads.js";
import { threadId } from "worker_threads";
import getGoogleAIAPIResponse from "../utils/gemini.js";


const router = express.Router();

//testing route
router.post("/test", async(req, res) => {
    try{
        const thread = new Thread({
            threadId : "12323",
            title : "Test thread",
        })
        const response = await thread.save();
        res.send(response)
    }catch(err) {
        res.status(500).json({error : err.message});
    }

});

//get all
router.get("/threads" , async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt : -1});
        res.json(threads);
    } catch (err) {
        res.status(500).json({error : err.message})
    }
});


//get one thread
router.get("/threads/:threadId" , async(req, res) => {
    try {
        const {threadId} = req.params;
        const thread = await Thread.findOne({threadId});
        
        if(!thread){
            res.status(404).json({error : "Thread doesnt exists!!"})
        }

        res.json(thread.messages)

    } catch (err) {
        res.status(500).json({error : err.message})
    }
})

//delete one thread
router.delete("/threads/:id" , async(req, res) => {
    const {id} = req.params;

    try {
        const thread = Thread.findOne({threadId : id});
        
        const deletedThread = await Thread.findOneAndDelete({threadId : id});

        if(!deletedThread){
            res.status(404).json({error : "Thread doesnt exists!!"})
        }

        res.status(200).json({success : "Thread deleted successfully!"})
    } catch (err) {
        res.status(500).json({error : err.message})
    }
})


//create a chat / thread
router.post("/chat" , async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(404).json({message : "Missing fields"})
    }

    try {
        let thread = await Thread.findOne({threadId :threadId});
        if(!thread){
            thread = new Thread({
                threadId,
                title : message ,
                messages : [{
                    role : "user",
                    content : message
                }]
            })

        }
        else{
            thread.messages.push({
                    role : "user",
                    content : message
                })
        }

        const assistantReply = await getGoogleAIAPIResponse(message);

        thread.messages.push({
            role : "assistant",
            content : assistantReply
        });

        thread.updatedAt = Date.now();

        await thread.save();

        res.json({reply : assistantReply});

        
    } catch (err) {
        res.status(500).json({error : err.message})
    }
})

export default router;