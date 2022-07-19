const express = require("express");
const { signUpUser, getUser } = require("../Controllers/UserController");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", getUser);

module.exports = router;
