const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Journal } = require("../models/userJournalModel");

const {
  addJournal,
  getJournal,
  deleteJournal,
  getJournalByPublisher,
  getJournalByID,
  updateJournal,
  journalBySubAdmin,
  addFeedback,
  getJournalsWithFeedback,
  getJournalsByPublisher,
  assignJournalToSubadmins,
  getAssignedJournals,
} = require("../userControllers/userJournalController");
const { storage, fileFilter } = require("../middleware/multerStorage");

const upload = multer({ storage, fileFilter }).fields([
  { name: "image" },
  { name: "document" },
]);

router.get("/Journal", getJournal);
router.get("/Journal/:_id", getJournalByID);
router.get("/JournalByPublisher/:publisherID", getJournalByPublisher);
router.post("/addJournal", upload, addJournal);
router.delete("/Journal/:_id", multer().none(), deleteJournal);
router.put("/updateJournal/:_id", upload, updateJournal);
router.put("/journalBySubAdmin",journalBySubAdmin);

router.post("/addFeedBack",addFeedback )
router.get("/getFeedBack",getJournalsWithFeedback )
router.get("/publisher/:publisherID", getJournalsByPublisher);
router.post("/assignJournalToSub", assignJournalToSubadmins);
router.get("/subAdminsAssignJournals/:subadminID", getAssignedJournals);


module.exports = router;
