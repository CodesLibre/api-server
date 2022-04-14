import {model, Schema} from 'mongoose'

const userShema = new Schema({
    firstName: {type:String, required: true},
    subName: {type:String, required: true},
    date: {type:String},
    sexe: {type:String, required: true},
    tel: {type:Number},
    postalCode: {type:Number},
    email: {type:String, required: true},
    password: {type:String, required: false},
    avatar: {type:String},
    subscribedBy: [{type:Schema.Types.ObjectId, ref:"User"}],
    subscribeCount: {type:Number, default:0},
    privatedData: [{type:String, required: true}],
},{
    timestamps: true
})
const User = model("User", userShema);

export default User;