const mongoose=require("mongoose")

const appointmentSchema=new mongoose.Schema({
    name:{type:String},
    
    date: {
            type: Date,
            required: true
          },
    slug:{
        type:String
    }
    
    

},{
    timestamps:true
})

const Appointment=mongoose.model("appointment",appointmentSchema)

module.exports=Appointment