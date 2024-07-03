const express=require("express");
const router=express.Router();
const Review=require("../models/reviews");
const Blog=require("../models/blog");
const ExpressError=require("../utils/expressError");
const { isLoggedIn,saveRedirectUrl, validateReview } = require("../middleware");



//post review route
router.post("/home/:id/reviews",isLoggedIn,async(req,res)=>{
    let blog=await Blog.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    blog.reviews.push(newReview);
    
    await newReview.save();
    await blog.save();
        
    req.flash("success","New Comment Added");
    res.redirect(`/home/${blog._id}`);
})

//delete route
router.delete("/home/:id/reviews/:reviewId",isLoggedIn,async(req,res)=>{
    let {id,reviewId}=req.params;
    await Blog.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/home/${id}`)
});


module.exports=router;