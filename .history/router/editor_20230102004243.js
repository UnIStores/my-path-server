const express = require("express");
const router = express.Router();
const tagBlockModel = require("../models/tagBlock");

router.get("/getList", function (req, res) {
  tagBlockModel
    .find({ pathId: req.query.pathId })
    .select("-_id")
    .then((data) => {
      res.status(200).send(data);
    });
});

router.post("/save", function (req, res) {
  console.log("====================================");
  const modifyList = req.body.modifyList;
  consople.log("modifyList : ", modifyList);
  console.log("====================================");

  tagBlockModel
    .findOneAndUpdate(
      { uuid: req.body.uuid },
      { ...req.body },
      { new: true, upsert: true, _id: false }
    )
    .then((data) => {
      res.status(200).send(data);
    });
  //   let tagBlock = tagBlockModel.findOne({ uuid: req.body.uuid }).then((data) => {
  //     console.log("data : ", data);
  //     data = { ...req.body };
  //   });

  //   new tagBlockModel({
  //     ...req.body,
  //   });

  //console.log("tagBlock: ", tagBlock);
  //tagBlock.save();
});

module.exports = router;
