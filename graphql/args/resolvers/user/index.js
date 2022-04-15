import {Article, User} from  "../../../models"
import { ForbiddenError } from "apollo-server-express"
export async function articles(parent, {}){
    return await Article.find({author: parent.id}).sort({_id:-1})
}
export async function favorites(parent, {}, {user}){
    if(parent.id !== user.id)
        throw new ForbiddenError("Operation not permited")
    return await  Article.find({favoritedBy: parent.id}).sort({_id:-1})
}
export async function subscribedBy(parent, {id}){
    return await User.find({_id: {$in: parent.subscribedBy}}).sort({_id:-1})
}
export async function subscribes(parent, {id}){
    return await User.find({subscribedBy: parent.id}).sort({_id:-1})
}
