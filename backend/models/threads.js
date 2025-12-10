import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
    role : {
        type : String,
        enum : ["user", "assistant"],
        required : true
    },
    content : {
        type : String,
        required : true
    },
    timeStamp : {
        type: Date,
        default : Date.now
    }
});


const ThreadSchema = new Schema({
    threadId : {
        type : String,
        unique : true,
        required : true
    },

    title : {
        type : String,
        required : true
    },
    messages : [MessageSchema],
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }

})

const Thread = mongoose.model("Thread", ThreadSchema);
export default Thread