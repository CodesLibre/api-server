import { ForbiddenError } from "apollo-server-express"
import {Comment, User} from  "../../../models"

export async function author(parent, {id}){
    return await User.findById(parent.author)
}
export async function favoritedBy(parent, {}, {user}){
    return await User.find({_id: {$in: parent.favoritedBy}})
}
export async function likedBy(parent, {}, {user}){
    return await User.find({_id: {$in: parent.likedBy}})
}
export async function comments(parent, {}, {user}){
    return await Comment.find({article: parent.id})
}
