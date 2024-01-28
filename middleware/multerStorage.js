const multer = require("multer");
const path = require("path");
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype == "image/jpg") {
      return cb(null, path.join("uploads", "images"));
    } else {
      return cb(null, path.join("uploads", "documents"));
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "image") {
      req.imageName = `${Date.now()}-${file.originalname}`;
      cb(null, req.imageName);
    } else if(file.fieldname === "document"){
      req.documentName = `${Date.now()}-${file.originalname}`;
      cb(null, req.documentName);
    }
  },
});

exports.fileFilter = function (req, file, cb) {
  if (file.fieldname === "image") {
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? cb(null, true)
      : cb(null, false);
  } else if (file.fieldname === "document") {
    file.mimetype === "application/msword" ||
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(null, false);
  }
};
