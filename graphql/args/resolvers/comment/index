import {Article, User, Comment, Answer} from  "../../../models"
import { ForbiddenError } from "apollo-server-express"
//list all article for a user
export async function commentedBy(parent){
    return await User.findOne({_id: parent.commentedBy})
}
export async function linkedToArticle(parent){
    return await Article.findOne({_id: parent.linkedToArticle});
}
export async function answers(parent){
    return await Answer.find({toComment: parent.id})
}