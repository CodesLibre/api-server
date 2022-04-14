import {User, Article} from  "../../../models"
import { hash, compare} from "bcrypt"
import jwt from "jsonwebtoken";
import env from "../../../../.env/config.json";
import {AuthenticationError, ForbiddenError} from "apollo-server-express"
import { Types } from "mongoose";

export async function signup (parent, args){
    const email = args.email.trim().toLowerCase();
    const hashed = await hash(args.password, 10);

    try{ 
        const user = await User.create({
            firstName: args.firstName,
            subName: args.subName,
            date: null,
            sexe: args.sexe,
            tel: null,
            postalCode: null,
            email: email,
            avatar: null,
            articles: [],
            privatedData: [],
            password: hashed
        })
        return jwt.sign({id: user._id}, env.server.auth.JWTSECRET)
    }catch(err){
        throw new AuthenticationError('IMPOSSIBLE TO CREATE AN ACCOUNT')
    }
}
export async function signin(parent, {email, password}){
    if(email)
        var email = email.trim().toLowerCase();
    const user = await User.findOne({email})
    if(!user)
        throw new AuthenticationError("email or password is incorrect")
    const pass = await compare(password, user.password)
    if(!pass)
        throw new AuthenticationError("email or password is incorrect")
    return jwt.sign({id: user._id}, env.server.auth.JWTSECRET)
}

export async function updateUser(parent, {id, firstName, subName, sexe, email},{user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    return await User.updateOne({_id: id}, {$set: {
            firstName, subName, sexe, email
        }},
        {
            new : true
        })
}
export async function deleteUser(parent, {id}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    try{
        await User.findOneAndRemove({_id: id})
        return true
    }catch(err){
        return false
    }
}
export async function toggleSubscribe(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    const _user = await User.findById(id)
    const hasUser = _user.subscribedBy.find(u=>String(u) === user.id)
    console.log(hasUser)
    if(!hasUser)
        return await User.findOneAndUpdate({
            _id: id
        },{
            $push: {
                subscribedBy: Types.ObjectId(user.id)
            },
            $inc: {
                subscribeCount: 1
            }
        },{
            new: true
        })
    else 
        return await User.findByIdAndUpdate(
            id,{
                $pull:{
                    subscribedBy: Types.ObjectId(user.id)
                },
                $inc:{
                    subscribeCount: -1
                }
            },{
                new: true
            })
}
export async function makeDataUserPrivated(parent, {id, privatedData}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    try{
        await User.updateOne({_id: id}, {$set: {
            privatedData
        }},
        {
            new : true
        })
        return privatedData
    }catch(err){
        return []
    }
}

export async function newArticle(parent, {title, textContent, videoLink}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    return await Article.create({
        title: title,
        textContent: textContent,
        author: Types.ObjectId(user.id)
    })
}

export async function updateArticle(parent, {id, title, textContent, videoLink}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    const article = await Article.findById(id)
    if(article && String(article.author) !== user.id)
        throw new ForbiddenError("You don't have permissions to delete the article")
    return await User.findOneAndUpdate({_id: id}, {$set: {
        title, textContent, videoLink
    }},
    {
        new : true
    })
}

export async function deleteArticle(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    const article = await Article.findById(id)
    if(article && String(article.author) !== user.id)
        throw new ForbiddenError("You don't have permissions to delete the article")
    try{
        article.remove()
        return true
    }catch(err){
        return false
    }
}

export async function toggleFavorite(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to change information')
    const article = await Article.findById(id)
    const hasUser = article.favoritedBy.find(a=>String(a) === user.id)
    console.log(hasUser)
    if(!hasUser)
        return await Article.findOneAndUpdate({
            _id: id
        },{
            $push: {
                favoritedBy: Types.ObjectId(user.id)
            },
            $inc: {
                favoriteCount: 1
            }
        },{
            new: true
        })
    else 
        return await Article.findByIdAndUpdate(
            id,{
                $pull:{
                    favoritedBy: Types.ObjectId(user.id)
                },
                $inc:{
                    favoriteCount: -1
                }
            },{
                new: true
            })
}