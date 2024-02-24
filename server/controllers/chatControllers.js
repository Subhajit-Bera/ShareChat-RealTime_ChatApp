const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//Fetching or Creationg one-on-one chat
const singleChat = asyncHandler(async (req, res) => {
    //Login user want to chat with
    const { userId } = req.body;

    //if User id is not send with req
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    //Find the chat
    var isChat = await Chat.find({
        isGroupChat: false,

        $and: [//Both id has to be true for one-on-one chat
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password") //populate users array of chatModel
        .populate("latestMessage"); //populate latestMessage of chatModel


    //Populate name,pic,email latest messge
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    }); //populate message model


    if (isChat.length > 0) { //check if the chat exist
        res.send(isChat[0]); //If exist then send the  response


    } else {
        //If chat not exist create new chat

        //create data for chat
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            //create chat with chatData
            const createdChat = await Chat.create(chatData);

            //Finding the chat with new created id and populate users array of chatModel
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});


//Get All chats
const getAllChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password") //for group chat
            .populate("latestMessage")
            .sort({ updatedAt: -1 }) //Sort from new to old
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


//Create Group Chat
const createGroupChat = asyncHandler(async (req, res) => {
    //if users and body is not given
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    //From the frontend send the array of users in stringify format and parse it in the backend
    var users = JSON.parse(req.body.users); //

    if (users.length < 2) { //Atleast 2 people are needed to create a group
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user); //Push the user who is creating the group or the admin

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//Rename Group
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true, // If not modified return the old one
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

//Add new member to Group
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

//Remove member from Group
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });

module.exports = {
    singleChat,
    getAllChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};