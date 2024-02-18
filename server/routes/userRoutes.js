const express = require("express");
const {
    registerUser,
    loginUser,
    searchUsers
  } = require("../controllers/userControllers");

  const { isLogin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/",registerUser);
router.get("/",isLogin,searchUsers);
router.post("/login", loginUser);

module.exports = router;