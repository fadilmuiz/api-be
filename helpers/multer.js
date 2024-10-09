// const multer = require("multer")
// const path = require("path")

// const documentStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads ")
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   }
// })

// const fileImage = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Upload only image"), false);
//   }
// }

// const upload = multer({ storage: documentStorage, fileFilter: fileImage });

// module.exports = upload

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


exports.multerMiddleware = upload.single("image");