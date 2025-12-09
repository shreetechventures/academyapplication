const mongoose = require("mongoose");

const ChampionSchema = new mongoose.Schema(
  {
    academyCode: { type: String, required: true },
    name: { type: String, required: true },
    examName: { type: String, required: true },
 year: Number,
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Champion", ChampionSchema);
