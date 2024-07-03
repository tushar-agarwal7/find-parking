module.exports=(fn)=>{
    console.log("wrap async");
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}