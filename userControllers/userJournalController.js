const {
  journalValidation,
  Journal,
  emailValidator,
} = require("../models/userJournalModel");
const { User } = require("../models/registrationModel");
const { validateEmailArray } = require("../middleware/emailValidator");

const objectid = require("objectid");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");

exports.addJournal = async function (req, res) {
  if (!objectid.isValid(req.body.publisherID)) {
    return res
      .status(400)
      .json({ message: "Valid mongodb object id is required." });
  }
  req.body.image = req.imageName;
  req.body.document = req.documentName;
  req.body.aurthors = req.body.aurthors.split(",");

  const { error } = journalValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {
    publisherID,
    articleTitle,
    url,
    volume,
    issueNumber,
    aurthors,
    image,
    document,
    abstract,
  } = req.body;
  try {
    const findPublisher = await User.findOne({ _id: publisherID });
    if (!findPublisher) {
      return res.status(404).json({
        error: `No Publisher was found with id ${req.body.publisherID}.`,
      });
    }

    const publisherName = findPublisher.username;

    const journal = await Journal.create({
      publisherID,
      publisherName,
      articleTitle,
      url,
      volume,
      issueNumber,
      aurthors,
      image,
      document,
      abstract,
    });
    return res.status(201).json({ message: "Successfully published", journal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJournal = async function (req, res) {
  try {
    const journal = await Journal.find();
    return res
      .status(201)
      .json({ message: "Successfully get all documents.", journal });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteJournal = async function (req, res) {
  const _id = req.params._id;
  try {
    if (!objectid.isValid(_id)) {
      return res
        .status(400)
        .json({ message: "Valid mongodb object id is required." });
    }

    // findOne cz to extract image || document name

    const searchJournal = await Journal.findOne({ _id });
    if (!searchJournal) {
      return res
        .status(404)
        .json({ message: `journal not found with id ${_id}` });
    }

    // delete from data base

    const { image, document } = searchJournal;
    const deleteJournal = await Journal.deleteOne({ _id });

    //to save sometime after deleting from db delete doc and img from file system

    fs.unlinkSync(path.join("uploads", "images", image));
    fs.unlinkSync(path.join("uploads", "documents", document));

    return res
      .status(200)
      .json({ message: `successfully deleted journal with id ${_id}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJournalByPublisher = async function (req, res) {
  const publisherID = req.params.publisherID;
  if (!objectid.isValid(publisherID)) {
    return res
      .status(400)
      .json({ message: "Valid mongodb object id is required." });
  }
  const journal = await Journal.find({ publisherID });
  if (journal.length <= 0)
    return res
      .status(400)
      .json({ message: `No journal found for publisher id ${publisherID}.` });

  return res.status(200).json({ journal });
};

exports.getJournalByID = async function (req, res) {
  const _id = req.params._id;
  try {
    const journal = await Journal.findOne({ _id });
    if (!journal) {
      return res
        .status(400)
        .json({ message: `No journal found for id ${_id}.` });
    }
    res.status(201).json({ journal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJournal = async function (req, res) {
  const _id = req.params._id;

  if (!objectid.isValid(_id)) {
    return res
      .status(400)
      .json({ message: "Valid mongodb object id is required." });
  }

  const { articleTitle, url, volume, issueNumber, aurthors, abstract } =
    req.body;
  let { image, document } = req.files;

  //protects from crash

  if (image) image = image[0].filename;

  if (document) document = document[0].filename;

  try {
    const findJournal = await Journal.findOne({ _id });
    if (!findJournal) {
      return res
        .status(404)
        .json({ error: `Journal not found with id ${_id}.` });
    }

    if (image) {
      fs.unlinkSync(path.join("uploads", "images", findJournal.image));
    }
    if (document) {
      fs.unlinkSync(path.join("uploads", "documents", findJournal.document));
    }

    const journal = await Journal.updateOne(
      { _id },
      {
        $set: {
          articleTitle,
          url,
          volume,
          issueNumber,
          aurthors,
          abstract,
          image,
          document,
        },
      }
    );

    return res.status(200).json({ message: "Journal updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const Joi = require('joi');
// const schema = Joi.object({
//   email: Joi.array().items(Joi.string().email()).required(),
// });

exports.journalBySubAdmin = async function (req, res) {
  // const error = schema.validate({email:req.body.email});
  // if(error)
  // {
  //   console.log(error);
  // }
  const { email, journalID } = req.body;

  if (typeof email === "undefined" || typeof journalID === "undefined") {
    return res
      .status(400)
      .json({ message: "All fields in body is mandantory." });
  }

  if (!objectid.isValid(journalID)) {
    return res.status(400).json({ message: "Provide valid journalID." });
  }

  const isValidEmails = validateEmailArray(email);
  if (!isValidEmails) {
    return res.status(400).json({ message: "please give valid email." });
  }

  try {
    const journal = await Journal.updateOne(
      { _id: journalID },
      {
        $set: {
          subAdmin: email,
        },
      }
    );
    return res
    .status(200)
    .json({ message: "Sub-Admin are successfully added in Journal" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", Error: error });
  }
};



// sub-admin feedback 

exports.addFeedback = async (req, res) => {
  const { _id, subadmin_id, feedbackText } = req.body;

  try {
    const journal = await Journal.findById(_id);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    // Assuming subadmins are identified by their user ID
    journal.feedback.push({ subadmin_id, feedbackText });
    await journal.save();

    return res.status(201).json({ message: "Feedback added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get journal with feedback

exports.getJournalsWithFeedback = async (req, res) => {
  try {
    const journals = await Journal.find().populate("feedback.subadmin_id", "username");

    return res.status(200).json({ journals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getJournalsByPublisher = async (req, res) => {
  const { publisherID } = req.params;

  try {
    const journals = await Journal.find({ publisherID });

    if (journals.length === 0) {
      return res.status(404).json({ message: "No journals found for the specified publisher." });
    }

    return res.status(200).json({ journals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.assignJournalToSubadmins = async (req, res) => {
  const { journalID, subadminIDs } = req.body;

  try {
    // Validate journal ID and subadmin IDs
    // if (!mongoose.Types.ObjectId.isValid(journalID) || !Array.isArray(subadminIDs)) {
    //   return res.status(400).json({ message: "Invalid journal or subadmin IDs." });
    // }

    // Check if the journal exists
    const journal = await Journal.findById(journalID);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    // Check if the subadmins exist
    const subadmins = await User.find({ _id: { $in: subadminIDs }, role: "subAdmin" });
    if (!subadmins) {
      return res.status(400).json({ message: "Invalid subadmin ID(s)." });
    }

    // Assign the journal to the subadmins
    journal.subAdmin = subadminIDs;
    await journal.save();

    return res.status(200).json({ message: "Journal assigned to subadmins successfully." });
  } catch (error) {
    console.error("Error assigning journal to subadmins:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.getAssignedJournals = async (req, res) => {
  const subadminID = req.params.subadminID;

  try {

    // Check if the subadmin exists
    const subadmin = await User.findById(subadminID);
    if (!subadmin || subadmin.role !== "subAdmin") {
      return res.status(400).json({ message: "Invalid subadmin ID." });
    }

    // Retrieve journals assigned to the subadmin
    const assignedJournals = await Journal.find({ subAdmin: subadminID });

    return res.status(200).json({ assignedJournals });
  } catch (error) {
    console.error("Error retrieving assigned journals:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};