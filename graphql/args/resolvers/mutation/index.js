import {User, Article, Comment, Answer} from  "../../../models"
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
        throw new AuthenticationError('You must be signed in to do anything')
    if(id !== user.id)
        throw new ForbiddenError("You don't have permissions to do this action")
    return await User.updateOne({_id: id}, {$set: {
            firstName, subName, sexe, email
        }},
        {
            new : true
        })
}
export async function deleteUser(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    if(id !== user.id)
        throw new ForbiddenError("You don't have permissions to do this action")
    try{
        const articles = await Article.find({author: id})
        const comments = await Comment.find({commenteBy: id})
        const answers = await Answer.find({answeredBy: id})
        articles.map(a=>a.remove())
        comments.map(a=>a.remove())
        answers.map(a=>a.remove())
        await User.findOneAndRemove({_id: id})
        return true
    }catch(err){
        return false
    }
}
export async function toggleSubscribe(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
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
        throw new AuthenticationError('You must be signed in to do anything')
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

/** SECTION ARTICLE */

/**
 * 
 * @param {*} parent 
 * @param {title, textContent, videoLink} object1 
 * @param {user} object2 
 * @returns Article
 */
export async function newArticle(parent, {title, textContent, videoLink}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    return await Article.create({
        title: title,
        textContent: textContent,
        author: Types.ObjectId(user.id)
    })
}

export async function updateArticle(parent, {id, title, textContent, videoLink}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const article = await Article.findById(id)
    if(article && String(article.author) !== user.id)
        throw new ForbiddenError("You don't have permissions to do this action")
    return await User.findOneAndUpdate({_id: id}, {$set: {
        title, textContent, videoLink
    }},
    {
        new : true
    })
}
/**
 * 
 * @param {*} parent Object
 * @param {id} param1 Object
 * @param {user} param2 Object
 * @returns Boolean
 */
export async function deleteArticle(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const article = await Article.findById(id)
    if(article && String(article.author) !== user.id)
        throw new ForbiddenError("You don't have permissions to do this action")
    try{
        article.remove()
        return true
    }catch(err){
        return false
    }
}
/**
 * 
 * @param {*} parent Object
 * @param {id} param1 Object
 * @param {user} param2 Object
 * @returns Article
 */
export async function toggleFavorite(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
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
/**
 * 
 * @param {*} parent Object
 * @param {id} param1 Object
 * @param {user} param2 Object
 * @returns Boolean
 */
export async function toggleLike(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const article = await Article.findById(id)
    const hasUser = article.likedBy.find(l=>String(l) === user.id)
    console.log(hasUser)
    if(!hasUser){
        await Article.findOneAndUpdate({
            _id: id
        },{
            $push: {
                likedBy: Types.ObjectId(user.id)
            },
            $inc: {
                likeCount: 1
            }
        },{
            new: true
        })
        return true;
    }
    else {
        await Article.findByIdAndUpdate(
            id,{
                $pull:{
                    likedBy: Types.ObjectId(user.id)
                },
                $inc:{
                    likeCount: -1
                }
            },{
                new: true
            })
        return false;
    }
}

/** SECTION COMMENT */

export async function newComment(parent, {id, content}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const article = await Article.findById(id)
    return Comment.create({
        content : content,
        commentedBy: Types.ObjectId(user.id),
        article: Types.ObjectId(article.id)
    })
}

export async function updateComment(parent, {id, content}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const comment = await Comment.findById(id)
    return Comment.findByIdAndUpdate(
        id,{
            $set:{content : content}
    },{
        new: true
    })
}

export async function deleteComment(parent, {id}, {user}){
    if(!user)
        throw new AuthenticationError('You must be signed in to do anything')
    const comment = await Comment.findById(id)
    if(comment && String(comment.commenteBy) !== user.id)
        throw new ForbiddenError("You don't have permissions to do this action")
    try{
        comment.remove()
        return true
    }catch(err){
        return false
    }
}