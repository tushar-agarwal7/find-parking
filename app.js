if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
    }

const express=require("express");
const app=express();
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const mongoose=require("mongoose");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const {blogSchema}=require("./schema.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const ExpressError=require("./utils/expressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
// const Review=require("./models/reviews.js")


const blogRouter=require("./routes/blog.js");
const userRouter=require("./routes/user.js");
const reviewRouter=require("./routes/review.js")

const dbUrl=process.env.ATLASDB_URL
         
main().then(()=>{
    console.log("connection successful");
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}




app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"));


const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
  })

  store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err)
  })

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly:true
    },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());// Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());//Generates a function that is used by Passport to deserialize users into the session

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curuser=req.user;
    next();
})



app.use("/",blogRouter);
app.use("/user",userRouter);
app.use("/",reviewRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
  })
  //error handler
  app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message})
    res.status(statusCode).send(message);
    res.send("something went wrong")
  })


app.listen(8080,(req,res)=>{
    console.log("app is listening on port 8080")
})