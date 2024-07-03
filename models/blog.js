const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js")

const blogSchema=new Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    location:{
        type:String,
    },
    contact:{
        type:String,
    },

    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})

blogSchema.post("findOneAndDelete",async(blog)=>{
    if(blog){
        await Blog.deleteMany({_id:{$in:blog.reviews}})
    }
})



const Blog=mongoose.model("Blog",blogSchema);
module.exports=Blog;