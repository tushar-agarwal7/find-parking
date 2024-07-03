const Blog=require("./models/blog")
const ExpressError=require("./utils/expressError");
const {blogSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js")

module.exports.isLoggedIn=(req,res,next)=>{
  console.log("LOGIN ");
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/user/signin");
       }
       next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
     res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
  let {id}=req.params;
  let blog=await Blog.findById(id);
  if(!blog.owner.equals(res.locals.curuser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/home/${id}`);
  }
  next();
}


module.exports.validateblog=(req,res,next)=>{
  console.log("validate");
    let {error}=blogSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,error)
    }
    else{
      next();
    }
  }
  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error){
         let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }
  