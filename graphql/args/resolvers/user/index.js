import {Article} from  "../../../models"
import { ForbiddenError } from "apollo-server-express"
export async function articles(parent, {id}){
    return await Article.find({})
}
export async function favorites(parent, {}, {user}){
    if(parent.id !== user.id)
        throw new ForbiddenError("Operation not permited")
    return await  Article.find({favoritedBy: parent.id}).sort({_id:-1})
}

export function subscribedBy(parent, {id}){
    
}