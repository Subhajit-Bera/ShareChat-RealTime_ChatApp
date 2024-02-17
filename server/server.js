const express=require("express");
const dotenv = require("dotenv");
dotenv.config();
const app=express();


app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>");
})

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server started at port:${process.env.PORT}`)
})