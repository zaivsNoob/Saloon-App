const mongoose = require("mongoose")

const reviewSchema=new mongoose.Schema({
    name:{
        type:String
    },
    comment:{
        type:String,
    },
    star:{
        type:Number,
        enum:[1,2,3,4,5]
    }
    
},{
    timestamps:true
})

const Review=mongoose.model("review",reviewSchema)

module.exports=Review