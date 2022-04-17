import {model, Schema} from 'mongoose'

const articleShema = new Schema({
    title: {type:String, required: true},
    textContent: {type:String, required: true},
    videoLink: {type:String },
    author: {type:Schema.Types.ObjectId, ref: "User" },
    numberPages: {type:Number, default: 0 },
    nextArticle: {type:Schema.Types.ObjectId, ref: "Article" },
    prevArticle: {type:Schema.Types.ObjectId, ref: "Article" },
    favoritedBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    favoriteCount: {type:Number, default: 0 },
    likedBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    likeCount: {type:Number, default: 0 },
    unlikedBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    unlikeCount: {type:Number, default: 0 },
    readingBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    readingCount: {type:Number, default: 0 },
    viewedBy: [{type:Schema.Types.ObjectId, ref: "User" }],
    viewsCount: {type:Number, default: 0 },
},{
    timestamps: true
})
const Article = model("Article", articleShema);

export default Article;