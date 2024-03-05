const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");

const {isLogin} =require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",isLogin,sendMessage);
router.get("/:chatId",isLogin,allMessages);


module.exports = router;