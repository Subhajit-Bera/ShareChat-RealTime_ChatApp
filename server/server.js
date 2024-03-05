const express=require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app=express();

app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

// app.get("/",(req,res)=>{
//     res.send("<h1>Hello</h1>");
// })


// Error Handling middlewares
app.use(notFound);  //If path/route no found
app.use(errorHandler); //other errors

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server started at port:${process.env.PORT}`)
})