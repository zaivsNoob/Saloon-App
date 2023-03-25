const Shop=require("../model/Shop")
const Barber=require("../model/barber")
const Appointment=require("../model/appointment")
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken")
const slugify=require("slugify")


exports.initialForm= (req,res)=>{
    res.render("shopViews/index")
}


exports.formProcess= async(req,res)=>{

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const slug=slugify(`${req.body.name} ${req.body.address}`)
    const shop=new Shop({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        address:req.body.address,
        area:req.body.area,
        slug:slug

    })
    // console.log(shop._id.toString())
    
    try {
        await shop.save()

        const payload={
            email:shop.email
           }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
           
         res.cookie("access_token",token,{
            httpOnly:true
           })

        res.redirect("/shop/dashboard")
        const barbers={}
       
        
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ error: 'Email already exists' });
          } else {
            console.log(error);
            res.status(500).json({ error: 'Failed to create user account' });
          }
    }
}

exports.login=async(req,res)=>{
    try {
        const shop= await Shop.findOne({email:req.body.email})

        if(!shop){
            return res.status(404).send("No id found for this mail Id")
        }

       const isPassCorrect=bcrypt.compareSync(req.body.password, shop.password)

       if(!isPassCorrect){
        return res.status(401).send("Password incorrect")
       }

       const payload={
        email:shop.email
       }

       

       const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
       
       res.cookie("access_token",token,{
        httpOnly:true
       })

       res.redirect("/shop/dashboard")
      

    } catch (error) {
        return res.status(500).json({error:"Internal server problem"},)
    }
}

//needs to work
exports.dashboard=async(req,res)=>{
    
    const shop=await Shop.findOne({email:req.email}).populate("barbers")
     
    if(!shop){
        return res.status(404).json("No Shop found")
    }
    
      
    
      const appointments=await Appointment.find({slug:shop.slug})
    
    const barbers=shop.barbers
    const services=shop.services
    
    // console.log(shop.barbers[0].appointments)\
    // appointments={}
    
   
    
   res.render("shopViews/dashboard",{shop,barbers,services,appointments})
}
exports.barbarRegister=async(req,res)=>{

    const barber= new Barber(req.body)
    
    try {
       await barber.save()
     const shop=await Shop.findOne({email:req.email})

       shop.barbers.push(barber._id)
       await shop.save()
       res.redirect("/shop/dashboard")
    } catch (error) {
        res.send(500).json("Some error")
    }
}

exports.serviceRegister=async(req,res)=>{
    const {name,price}=req.body
    

      try {
        const shop=await Shop.findOne({email:req.email})
    shop.services.push({
        name: name,
        price: price
      });
      shop.save()
      res.redirect("/shop/dashboard")
      } catch (error) {
        return res.status(500).json("Internal Server error")
      }
}
exports.logout=async(req,res)=>{
    res.clearCookie('access_token')
    res.redirect("/shop/login")
}