import { ForbiddenError } from "apollo-server-express"
import {Article, Comment, User} from  "../../../models"

export async function answeredBy(parent){
    return await User.findById(parent.answeredBy)
}
export async function toComment(parent){
    return await Comment.findById(parent.toComment)
}
