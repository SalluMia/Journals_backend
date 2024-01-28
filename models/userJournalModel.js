const mongoose = require("mongoose");
const Joi = require("joi");

const userJournalSchema = new mongoose.Schema({
  publisherID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  publisherName: {
    type: String,
    required: true,
  },
  articleTitle: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,
  },
  url: {
    type: String,
    // required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  issueNumber: {
    type: Number,
    required: true,
  },
  aurthors: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  subAdmin:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
  }],
  feedback: [
    {
      subadmin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
      },
      feedbackText: {
        type: String,
      },
    },
  ],
});

function journalValidation(journal) {
  const schema = Joi.object({
    publisherID: Joi.string().required(),
    articleTitle: Joi.string().min(10).max(255).required(),
    url: Joi.string().required(),
    volume: Joi.string().required(),
    issueNumber: Joi.number().required(),
    aurthors: Joi.array().items(Joi.string()).required(),
    image: Joi.string().required(),
    document: Joi.string().required(),
    abstract: Joi.string().required(),
  });
  return schema.validate(journal);
}

function emailValidator(email) {
  const Schema = Joi.object({
    email: Joi.array().items(Joi.string().email()).required(),
  });
  return Schema.validate({email});
}

const userJournalModel = new mongoose.model("journal", userJournalSchema);

module.exports = {
  journalValidation,
  Journal: userJournalModel,
  emailValidator,
};
