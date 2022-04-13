import {User, Article} from  "../../../models"
export async function author(parent, {id}){
    return await User.findById(parent.author)
}