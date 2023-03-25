const mongoose = require("mongoose")

const shopSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true

    },
    address:{
        type:String
    },
    area:{
        type:String
    },

    barbers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'barber',
       
      }],
      services: {
        type: [{
          name: String,
          price: Number
        }],
       
      },
      slug:{
        type:String
      }

},{
    timestamps:true
})

const Shop=mongoose.model("shop",shopSchema);

module.exports=Shop