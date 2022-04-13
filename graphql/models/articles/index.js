import {model, Schema} from 'mongoose'

const articleShema = new Schema({
    title: {type:String, required: true},
    textContent: {type:String, required: true},
    videoLink: {type:String },
    author: {type:Schema.Types.ObjectId, ref: "User" },
    favoritedBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    favoriteCount: {type:Number, default: 0 },
},{
    timestamps: true
})
const Article = model("Article", articleShema);

export default Article;