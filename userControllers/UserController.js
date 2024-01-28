const {
  User,
  userRegisterValidation,
  logInValidation,
} = require("../models/registrationModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendUserCredentialsMail } = require("../mail/mails");
// @URL     /api/users/signup
exports.signup = async (req, res) => {
  console.log(req.body);
  const { error } = userRegisterValidation(req.body);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let { username, email, password } = req.body;
  try {
    password = await bcrypt.hash(password, 12);
    const isExisting = await User.findOne({ $or: [{ email }, { username }] });
    console.log(isExisting);
    if (isExisting) {
      return res.status(400).json({
        message: "A user already exists with the given email or username.",
      });
    }
    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: `Successfully created account`,
      user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @URL     /api/users/login
exports.Login = async (req, res) => {
  const { error } = logInValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const { _id, role, email } = user;
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with given credentials." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ Message: "Invalid password." });
    }

    res.status(200).json({
      message: "Successfully logged in",
      role,
      _id,
      email,
      username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.sendInviteMail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exist." });
    }

    const user = await User.create({
      email,
    });


    // Send invite email
    await sendUserCredentialsMail(user,email);

    return res.status(200).json({ message: "Invite email sent successfully." });
  } catch (error) {
    console.error("Error sending invite email:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.addSubadminCredentials = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if the user with the provided email exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already a subadmin
    if (existingUser.role === "subAdmin") {
      return res.status(400).json({ message: "User is already a subadmin." });
    }

    // Update user role to subadmin and set the provided username and hashed password
    existingUser.role = "subAdmin";
    existingUser.username = username;
    existingUser.password = await bcrypt.hash(password, 12);

    await existingUser.save();

    return res.status(200).json({ message: "SubAdmin credentials added successfully." });
  } catch (error) {
    console.error("Error adding subadmin credentials:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

