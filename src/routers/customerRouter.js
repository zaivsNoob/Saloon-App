const express=require("express")
const route=new express.Router()

const Shop=require("../model/Shop")
const Barber=require("../model/barber")
const Review=require("../model/review")
const Appointment=require("../model/appointment")

/*
this will get list .for that need to get shop list.
*/

//all shops
route.get("/",async(req,res)=>{
    const shops=await Shop.find()
   
   res.render("shopList",{shops})
})

//single shop page
route.get("/:slug",async(req,res)=>{

    try {
        const shopping=await Shop.findOne({slug:req.params.slug}).populate("barbers")
        if(!shopping){
            return res.status(404).json("Shop not found!!")
        }

        const { password, _id, ...shop } = shopping.toObject();
        
        res.render("singleShop",{shop})
    } catch (error) {
        res.status(500).send("internal server error")
    }
})

//single barber page
route.get("/:slug/:name",async(req,res)=>{
    try {
        const shop=await Shop.findOne({slug:req.params.slug}).populate("barbers")
        const barbers=shop.barbers.filter(barber => barber.name === req.params.name)
        const {_id,...barber}=barbers[0].toObject()

        const singleBarber=await Barber.findById(barbers[0]._id).populate("reviews")
       
       
      const reviews=singleBarber.reviews
      
        res.render("singleBarber",{shop,barber,reviews})
    } catch (error) {
        res.status(500).send("error")
    }
})

//needs refactoring
route.post("/:slug/:name/review-register",async(req,res)=>{
        const review=new Review(req.body)
    try {
        review.save()
        const shop=await Shop.findOne({slug:req.params.slug}).populate("barbers")
        const barber_searched=shop.barbers.filter(barber => barber.name === req.params.name)
        const barber=await Barber.findById(barber_searched[0]._id)
        barber.reviews.push(review._id)
       
        
        await barber.save()
        res.redirect(`/customer/${req.params.slug}/${req.params.name}`)
    } catch (error) {
        console.log(error)
    }
})


route.post("/:slug/:name/appointment-register",async(req,res)=>{
    const newAppointment = new Appointment({
        name: req.body.name,
        date: new Date(req.body.date),
        slug:req.params.slug
        
      });

    try {
        const shop=await Shop.findOne({slug:req.params.slug})
        .populate({
          path: 'barbers',
          match: { name:req.params.name },
          populate: { path: 'reviews' }
        })
      
    
        
        await newAppointment.save()
        shop.barbers[0].appointments.push(newAppointment._id)
        // await shop.save()
        await shop.barbers[0].save()
        res.redirect(`/customer/${req.params.slug}/${req.params.name}`)
        
    } catch (error) {
        res.send(error)
    }
})




module.exports=route