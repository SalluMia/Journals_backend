const { Journal } = require("../models/userJournalModel");
const { User } = require("../models/registrationModel");

const objectId = require("objectid");

exports.updateJournalStatus = async function (req, res) {
  const { status, _id } = req.body;

  if (!objectId.isValid(_id)) {
    return res
      .status(400)
      .json({ error: "Invalid MongoDB ObjectId provided." });
  }

  const validStates = ["Approved", "Rejected"];
  if (!validStates.includes(status)) {
    return res.status(400).json({
      error: "Invalid status provided. Please use 'Approved' or 'Rejected'.",
    });
  }

  try {
    const updateResult = await Journal.updateOne(
      { _id },
      {
        $set: {
          status,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: `No journal was found with id ${_id}.` });
    }

    return res
      .status(200)
      .json({ message: "Journal status updated successfully." });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating the journal status.",
      details: error.message,
    });
  }
};

exports.getAllUser = async function (req, res) {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
    
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server error.",
      details: error.message,
    });
  }
};
