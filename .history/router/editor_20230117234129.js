const express = require("express");
const router = express.Router();
const tagBlockModel = require("../models/tagBlock");
const fileDataModel = require("../models/fileData");

router.get("/getList", function (req, res) {
  // tagBlockModel
  //   .find({ pathId: req.query.pathId })
  //   .populate("files")
  //   .select("-_id")
  //   .then((data) => {
  //     res.status(200).send(data);
  //   });
  tagBlockModel
    .find({ pathId: req.query.pathId })
    .select("-_id")
    .exec()
    .then((data) => {
      data.map((tag, index) => {
        console.log(index);
        if (tag.tagName === "image") {
          fileDataModel
            .find({ uuid: tag.uuid })
            .exec()
            .then((file) => {
              console.log("file : ", file);
            });
        }
        console.log("end");
        res.status(200).send(data);
      });
    });
});

router.post("/save", function (req, res) {
  const modifyList = req.body;

  modifyList.map((blockData) => {
    if (blockData.type === "delete") {
      tagBlockModel.deleteOne({ uuid: blockData.data.uuid }).exec();
    } else {
      tagBlockModel
        .findOneAndUpdate(
          { uuid: blockData.data.uuid },
          { ...blockData.data },
          { new: true, upsert: true }
        )
        .exec();
    }
  });
  res.status(200).send();
});

module.exports = router;
