const express = require("express");
const router = express.Router();
const tagBlockModel = require("../models/tagBlock");
const multer = require("multer");

router.get("/getList", function (req, res) {
  tagBlockModel
    .find({ pathId: req.query.pathId })
    .select("-_id")
    .then((data) => {
      res.status(200).send(data);
    });
});

router.post("/save", function (req, res) {
  const modifyList = req.body;

  console.log("modifyList: ", modifyList);

  modifyList.map((blockData) => {
    if (blockData.type === "delete") {
      tagBlockModel.deleteOne({ uuid: blockData.data.uuid }).exec();
    } else {
      //multer
      //test
      if (blockData.data.tagName === "image") {
        const upload = multer({ dest: "images/" });
        upload.single("file");
        tagBlockModel
          .findOneAndUpdate(
            { uuid: blockData.data.uuid },
            { ...blockData.data },
            { new: true, upsert: true }
          )
          .exec();
      } else {
        tagBlockModel
          .findOneAndUpdate(
            { uuid: blockData.data.uuid },
            { ...blockData.data },
            { new: true, upsert: true }
          )
          .exec();
      }
    }
  });
  res.status(200).send();
});

module.exports = router;
