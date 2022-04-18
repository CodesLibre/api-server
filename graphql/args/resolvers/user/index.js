import {Article, User} from  "../../../models"
import { ForbiddenError } from "apollo-server-express"
//list all article for a user
export async function articles(parent){
    return await Article.find({author: parent.id}).sort({_id:-1})
}
//list all favorites article for a user
export async function favorites(parent, {}, {user}){
    if(parent.id !== user.id)
        throw new ForbiddenError("Operation not permited!")
    return await  Article.find({favoritedBy: parent.id}).sort({_id:-1})
}
//list all articles viewed for a user
export async function views(parent, {}, {user}){
    if(parent.id !== user.id)
        throw new ForbiddenError("Operation not permited!")
    return await  Article.find({viewedBy: parent.id}).sort({_id:-1})
}
export async function reads(parent, {}, {user}){
    if(parent.id !== user.id)
        throw new ForbiddenError("Operation not permited!")
    return await  Article.find({readingBy: parent.id}).sort({_id:-1})
}
export async function subscribedBy(parent, {id}){
    return await User.find({_id: {$in: parent.subscribedBy}}).sort({_id:-1})
}
export async function subscribes(parent, {id}){
    return await User.find({subscribedBy: parent.id}).sort({_id:-1})
}
