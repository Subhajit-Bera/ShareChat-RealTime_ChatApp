const express = require("express");
const { isLogin } = require("../middleware/authMiddleware");

const {
    accessChat,
    // fetchChats,
    // createGroupChat,
    // removeFromGroup,
    // addToGroup,
    // renameGroup,
  } = require("../controllers/chatControllers");


const router = express.Router();

router.post("/", isLogin, accessChat);
// router.get("/", isLogin, fetchChats);
// router.post("/group", isLogin, createGroupChat);
// router.put("/rename", isLogin, renameGroup);
// router.put("/groupremove", isLogin, removeFromGroup);
// router.put("/groupadd", isLogin, addToGroup);

module.exports = router;