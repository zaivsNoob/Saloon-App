const jwt=require("jsonwebtoken")

exports.Auth=(req,res,next)=>{
    const token=req.cookies.access_token
    
   

    try {
        if(!token){
            return res.status(401).json("Unauthorized action")
        }
        const shop=jwt.verify(token,process.env.JWT_SECRET)
       
       req.email=shop.email
       next()
    } catch (error) {
        res.clearCookie("access_token")
        res.redirect("/shop/login")
    }
}