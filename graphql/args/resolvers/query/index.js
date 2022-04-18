import {User, Article, Comment, Answer} from "../../../models"
import {AuthenticationError, ForbiddenError} from "apollo-server-express"
export async function users(){
    const users =  await User.find({})
    if(users)
        var newUser = users.map(u=>{
            if(u)
                for(const el of u.privatedData)
                    u[el] = null
            return u
        })
    return users
}
export async function user (parent, {email}){
    const _user = await User.findOne({email})
    if(_user)
        for(const el of _user.privatedData)
            _user[el] = null
    return _user
}
export async function me(){
    if(!user)
        throw new AuthenticationError('You must be signed in')
    const _user = await User.findById(user.id)
    if(_user)
        for(const el of _user.privatedData)
            _user[el] = null
    return _user
}
export async function articles(){
    return await Article.find({}).sort({_id:-1})
}
export async function article (parent, args){
    return await Article.findById(args.id)
}
export async function comment(parent, {id}){
    return await Comment.findById(id)
}
export async function answer(parent, {id}){
    return await Answer.findById(id)
}