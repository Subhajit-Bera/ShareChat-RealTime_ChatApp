const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);



const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname1, '..', 'client', 'build')));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, '..', 'client', 'build', 'index.html'))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}








// Error Handling middlewares
app.use(notFound);  //If path/route no found
app.use(errorHandler); //other errors


const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started at port:${process.env.PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
})