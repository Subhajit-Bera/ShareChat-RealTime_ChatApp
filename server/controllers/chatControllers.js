const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//Fetching or Creationg one-on-one chat
const singleChat = asyncHandler(async (req, res) => {
    //Login/current user
    const { userId } = req.body;
    
    //if User id is not send with req
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    //Find the chat
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password") //populate users array of chatModel
      .populate("latestMessage"); //populate latestMessage of chatModel

    //Finding latest messge
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    }); //populate message model

    if (isChat.length > 0) { //check if the chat exist
        res.send(isChat[0]); //If exist then send the  response
    } else {
        //If chat not exist create new chat
        var chatData = {     //create data for chat
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData); //create chat with chat dat
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            ); //Finding the chat with new created id and populate users array of chatModel
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

module.exports = {
    singleChat,
    // fetchChats,
    // createGroupChat,
    // renameGroup,
    // addToGroup,
    // removeFromGroup,
};