const express = require("express");
const router = express.Router();
const { Login, signup, SubadminCreate, sendInviteMail, addSubadminCredentials } = require("../userControllers/UserController");
const multer = require("multer");

router.post("/login", multer().none(), Login);
router.post("/signup", multer().none(), signup);
router.post("/sendInviteEmail", multer().none(), sendInviteMail);
router.post("/createSubadmin", multer().none(), addSubadminCredentials);


module.exports = router;
