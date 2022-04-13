import {User, Article} from "../../../models"
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
    const user = await User.findOne({email})
    if(user)
        for(const el of user.privatedData)
            user[el] = null
    return user
}
export async function me(parent, {}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in')
    const _user = await User.findById(user.id)
    if(_user)
        for(const el of _user.privatedData)
            _user[el] = null
    return _user
}
export async function articles(){return await Article.find()}
export async function article (parent, args){return await Article.findById(args.id)}