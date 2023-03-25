
const express=require("express")
require('dotenv').config()
require("./src/db/mongoose")
const cookieParser=require("cookie-parser")

const shopRouter=require('./src/routers/shopRouter')
const customerRouter=require('./src/routers/customerRouter')

const app=express()
const port=process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.set('views', './views')
app.set("view engine",'ejs')

app.use("/shop",shopRouter)
app.use("/customer",customerRouter)

app.listen(port,()=>{
    console.log(`app is listeing at ${port}`)
})