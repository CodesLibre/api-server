import {model, Schema} from 'mongoose'

const answerShema = new Schema({
    AnsweredBy: {type:Schema.Types.ObjectId, ref: "User"},
    content: {type:String, required: true},
    toComment: {type:Schema.Types.ObjectId, ref: "Comment"}
},{
    timestamps: true
})
const Answer = model("Answer", answerShema);

export default Answer;