const express = require("express");
const { isLogin } = require("../middleware/authMiddleware");

const {
    singleChat,
    // fetchChats,
    // createGroupChat,
    // removeFromGroup,
    // addToGroup,
    // renameGroup,
  } = require("../controllers/chatControllers");


const router = express.Router();

router.post("/", isLogin, singleChat);
// router.get("/", isLogin, fetchChats);

//Group Related Routes
// router.post("/group", isLogin, createGroupChat);
// router.put("/rename", isLogin, renameGroup);
// router.put("/groupremove", isLogin, removeFromGroup);
// router.put("/groupadd", isLogin, addToGroup);

module.exports = router;