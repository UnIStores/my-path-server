const express = require("express");
const router = express.Router();
const pathCardModel = require("../models/pathCard");
const tagBlockModel = require("../models/tagBlock");
const styleDataModel = require("../models/styleData");

router.get("/", async function (req, res) {
  try {
    const pathCard = await pathCardModel.findById(req.query.pathId);
    const pathId = pathCard._id.toString();

    const tagList = await tagBlockModel.aggregate([
      { $match: { pathId } },
      {
        $lookup: {
          from: "files",
          localField: "uuid",
          foreignField: "uuid",
          as: "files",
        },
      },
      {
        $lookup: {
          from: "styles",
          let: { styleUuid: "$uuid" },
          pipeline: [
            { $match: { $expr: { $eq: ["$uuid", "$$styleUuid"] } } },
            { $limit: 1 },
          ],
          as: "style",
        },
      },
      {
        $addFields: {
          style: { $ifNull: [{ $arrayElemAt: ["$style", 0] }, {}] },
        },
      },
    ]);
    res.status(200).send(tagList);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/", function (req, res) {
  const modifyList = req.body;
  modifyList.map((block) => {
    if (block.type === "delete") {
      tagBlockModel.deleteOne({ uuid: block.data.uuid }).exec();
      styleDataModel.deleteOne({ uuid: block.data.uuid }).exec();
      if (block.data.tagName === "image") {
        fileModel.deleteOne({ uuid: block.data.uuid }).exec();
      }
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

router.post("/style", function (req, res) {
  const { uuids, style } = req.body;
  const updateActions = Object.keys(style).map((key) => {
    const updateOperation = {};
    if (style[key]) {
      updateOperation["$set"] = { [key]: style[key] };
    } else {
      updateOperation["$unset"] = { [key]: "" };
    }
    return updateOperation;
  });

  uuids.forEach((uuid) => {
    styleDataModel
      .findOneAndUpdate({ uuid }, ...updateActions, { upsert: true })
      .exec();
  });

  res.status(200).send();
});

module.exports = router;
