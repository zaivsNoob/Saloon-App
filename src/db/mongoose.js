const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    
    
   
}).then(() => {
    console.log("database connected")
}).catch((e)=>{
    console.log(e)
})