const express = require("express");
const { isLogin } = require("../middleware/authMiddleware");

const {
    singleChat,
    getAllChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
    
  } = require("../controllers/chatControllers");


const router = express.Router();

router.post("/", isLogin, singleChat);
router.get("/", isLogin, getAllChats);

//Group Related Routes
router.post("/group", isLogin, createGroupChat);
router.put("/rename", isLogin, renameGroup);
router.put("/groupadd", isLogin, addToGroup);
router.put("/groupremove", isLogin, removeFromGroup);


module.exports = router;