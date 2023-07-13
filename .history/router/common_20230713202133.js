const express = require("express");
const router = express.Router();
const fileDataModel = require("../models/fileData");
const tagBlockModel = require("../models/tagBlock");
const fs = require("fs");
const multer = require("multer");
const fileData = require("../models/fileData");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    console.log("extArray: ", extArray);

    fileDataModel.count().then((count) => {
      cb(null, count.toString() + "." + extension);
    });
  },
});

const upload = multer({ storage: storage });

router.get("/images/:fileName", function (req, res) {
  const fileId = req.params.fileName;

  fileDataModel.findOne({ fileId }).then((data) => {
    if (data) {
      fs.readFile(
        "./images/" + data?.fileId + "." + data.extension,
        function (err, data) {
          res.writeHead(200, { "Context-Type": "text/html" });
          res.end(data);
        }
      );
    }
  });
});

router.post("/upload", upload.single("img"), (req, res) => {
  console.log("1");
  const originalName = Buffer.from(req.file.originalname, "latin1").toString(
    "utf8"
  );

  const idx = req.file.filename.lastIndexOf(".");
  const extension = req.file.filename.substring(
    idx + 1,
    req.file.filename.length
  );

  const uuid = req.body.uuid;
  const width = req.body.width;
  fileData.findOne({ uuid }).then((file) => {
    if (file) {
      fs.unlinkSync(`./images/${file.fileId}.${file.extension}`);
      fileData.deleteOne({ fileId: file.fileId }).exec();
    }
  });

  tagBlockModel
    .findOne({ uuid })
    .exec()
    .then(() => {
      const fileData = new fileDataModel({
        uuid: uuid,
        fileName: originalName, //original File Name
        extension: extension,
        width: width,
      });
      fileData.save();
      res.status(200).json([fileData]);
    });
});

module.exports = router;