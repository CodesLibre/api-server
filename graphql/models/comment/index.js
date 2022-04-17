import {model, Schema} from 'mongoose'

const commentShema = new Schema({
    commentedBy: {type:Schema.Types.ObjectId, ref: "User"},
    content: {type:String, required: true},
    linkedToArticle: {type:Schema.Types.ObjectId, ref: "Article"},
},{
    timestamps: true
})
const Comment = model("Comment", commentShema);

export default Comment;