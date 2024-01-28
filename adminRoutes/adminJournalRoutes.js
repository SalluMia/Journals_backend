const express = require("express");
const { updateJournalStatus, getAllUser } = require("../adminControllers/adminJournalControllers");
const router = express.Router();

router.put('/updateJournalStatus' , updateJournalStatus);
router.get('/getAllUsers',getAllUser);

module.exports = router;