const mongoose = require("mongoose");

const pathCardSchema = new mongoose.Schema(
  {
    pathId: { type: Number, required: true, unique: true },
  },
  { timestames: true }
);

module.exports = mongoose.model("PathCard", pathCardSchema);
