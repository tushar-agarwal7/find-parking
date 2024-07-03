const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");


 
router.get("/signup",(req,res)=>{
    res.render("listings/signup.ejs");
})

router.post("/signup", async (req,res)=>{
    try{
    let  {username,email,password}=req.body;
    const newUser=  new User({email,username});
    const registeredUser= await User.register(newUser,password);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","Welcome to ParkAvenue");
    res.redirect("/home");
   })
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup")
    }
})
router.get("/signin",(req,res)=>{
    res.render("listings/signin.ejs");
})

router.post("/signin", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/user/signin',failureFlash: true  }), (req,res)=>{
    req.flash("success","Welcome back to ParkAvenue")
    let redirectUrl=res.locals.redirectUrl || "/home"
   res.redirect(redirectUrl);

})

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!")
        res.redirect("/home")
    })
})


module.exports=router;