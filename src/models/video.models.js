import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(
    {
       VideoFile:{
        type:String,
        required:true
       },
       thumbnail:{
        type:String,
        required:true,
       },
       description:{
        type:String,
        required:true,
       },
        title:{
        type:String,
        required:true,
       },
       duration:{
        type:Number,
        required:true,
       },
       views:{
        type:Number,
        default:0,
        required:true
       },
       isPublished:{
        type:Boolean,
        default:true
       },
       owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
       }  
    },
    {timestamps:true}
)

VideoSchema.plugin(mongooseAggregatePaginate) // it is useful for aggregation and with the help of this we can easily use aggregation

export const Video = mongoose.model("Video",VideoSchema)

