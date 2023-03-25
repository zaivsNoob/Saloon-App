const mongoose = require("mongoose")

const barberSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      specialty: {
        type: String,
        required: true
      },
      reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
      }],
      appointments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointment"
      }]
},{timestamps:true})

const Barber=mongoose.model("barber",barberSchema)

module.exports = Barber