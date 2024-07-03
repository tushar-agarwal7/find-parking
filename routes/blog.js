const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Blog=require("../models/blog");
const { isLoggedIn, validateblog,isOwner } = require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({ storage});


router.get("/", async(req,res)=>{

    res.redirect('/home')
})

//home route
router.get("/home", async(req,res)=>{
    const allBlogs=await Blog.find({}).populate("owner")
    res.render("listings/home.ejs",{allBlogs});
})

//booking
router.get("/home/:id/book",isLoggedIn, async(req,res)=>{
    let {id}=req.params;
    const blog=await Blog.findById(id)
    if(!blog){
        req.flash("success"," you requested for does not exist");
        res.redirect("/home");
    }
    res.render("listings/book.ejs",{blog})
})


//fake-payment
router.get("/home/:id/fake-pay",(req,res)=>{
    req.flash("success","Payment Done Your Seat is booked");
    res.redirect(`/home`);

     
})


//new route
router.get("/new", isLoggedIn,async (req,res)=>{
    res.render("listings/new.ejs")
})

//show route
router.get("/home/:id", async (req,res)=>{
    let {id}=req.params;
    const blog=await Blog.findById(id).populate("owner").populate({path:"reviews",populate:{path:"author"}})
    if(!blog){
        req.flash("error"," you requested for does not exist");
        res.redirect("/home");
    }  
    res.render("listings/show.ejs",{blog})
})

//search
router.get("/search", async (req,res)=>{
    const query = req.query.q;
    const results = await Blog.find({"location" : { '$regex' : query, '$options' : 'i' }}); 
   
    res.render("listings/searchResults.ejs",{results})
})
//create route
router.post("/home", isLoggedIn ,upload.single("blog[image]"),async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newblog=new Blog(req.body.blog);
    newblog.owner=req.user._id;3
    newblog.image={url,filename};
    await newblog.save();
    req.flash("success","New Place Added");
    res.redirect("/home");
})


//edit route
router.get("/home/:id/edit", isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    const blog=await Blog.findById(id)
    if(!blog){
        req.flash("error"," you requested for does not exist");
        res.redirect("/home");
    }
    res.render("listings/edit.ejs",{blog})
})

//update route
router.put("/home/:id", isLoggedIn,isOwner,upload.single("blog[image]"),async(req,res)=>{
    let {id}=req.params;
    let blog=await Blog.findByIdAndUpdate(id,{...req.body.blog})
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        blog.image={url,filename}
        await blog.save();
    }
    req.flash("success","Your Post Updated");
    res.redirect(`/home/${id}`);
})

//destroy route
router.delete("/home/:id",  isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    let deletedblog=await Blog.findByIdAndDelete(id)
    console.log(deletedblog);
    req.flash("success","Your Place deleted Successfully")
    res.redirect("/home");
})

module.exports=router;  