import { ForbiddenError } from "apollo-server-express"
import {Article, Comment, User} from  "../../../models"

export async function author(parent){
    return await User.findById(parent.author)
}
export async function nextArticle(parent){
    return await Article.findById(parent.nextArticle)
}
export async function prevArticle(parent){
    return await Article.findById(parent.prevArticle)
}
export async function favoritedBy(parent){
    return await User.find({_id: {$in: parent.favoritedBy}}).sort({_id:-1})
}
export async function likedBy(parent){
    return await User.find({_id: {$in: parent.likedBy}}).sort({_id:-1})
}
export async function unlikedBy(parent){
    return await User.find({_id: {$in: parent.unlikedBy}}).sort({_id:-1})
}
export async function viewedBy(parent){
    return await User.find({_id: {$in: parent.viewedBy}}).sort({_id:-1})
}
export async function readingBy(parent){
    return await User.find({_id: {$in: parent.readingBy}}).sort({_id:-1})
}
export async function comments(parent){
    return await Comment.find({article: parent.id}).sort({_id:-1})
}
