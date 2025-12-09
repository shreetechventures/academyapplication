const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");

const {
  getChampions,
  addChampion,
  updateChampion,
  deleteChampion,
} = require("../controllers/champions.controller");

router.get("/:academyCode/champions", getChampions);

router.post(
  "/:academyCode/champions",
  upload.fields([{ name: "image" }, { name: "video" }]),
  addChampion
);

router.put(
  "/:academyCode/champions/:id",
  upload.fields([{ name: "image" }, { name: "video" }]),
  updateChampion
);

router.delete("/:academyCode/champions/:id", deleteChampion);

module.exports = router;
