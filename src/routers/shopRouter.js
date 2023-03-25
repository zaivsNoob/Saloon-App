const express=require("express")
const auth=require("../middleware/auth")



const route=new express.Router()

const shopController=require("../controllers/shopController")


//Registration form
route.get("/register",shopController.initialForm)
route.post("/register",shopController.formProcess)



//login form
route.get("/login",(req,res)=>{
    res.render("shopViews/loginForm")
})
route.post("/login",shopController.login)
route.post("/logout",shopController.logout)

route.get("/dashboard",auth.Auth,shopController.dashboard)
route.post("/barber-register",auth.Auth,shopController.barbarRegister)
route.post("/service-register",auth.Auth,shopController.serviceRegister)
// route.get("/welcome",auth.Auth,shopController.welcome)

module.exports=route
