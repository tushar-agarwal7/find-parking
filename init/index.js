const mongoose=require("mongoose")
const initdata =require("./data.js");
const Blog=require("../models/blog.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/iblogger");
}
Blog.collection.createIndex({ title: 'text'});
const initDB=async()=>{
    await Blog.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:"65b4a3877834e43284b6268a",
    }))
    await Blog.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();