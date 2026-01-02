const Champion = require("../models/Champion");

/* ======================================================
   GET CHAMPIONS
   🌱 academy resolved from JWT (SEED RULE)
====================================================== */
exports.getChampions = async (req, res) => {
  try {
    const academyCode = req.user.academyCode;

    const champions = await Champion.find({ academyCode })
      .sort({ createdAt: -1 }); // newest first

    // Group by Year (UNCHANGED)
    const grouped = {};

    champions.forEach((c) => {
      const year = c.year || new Date(c.createdAt).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(c);
    });

    res.json(grouped);
  } catch (err) {
    console.error("Error loading champions:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ======================================================
   ADD CHAMPION
====================================================== */
exports.addChampion = async (req, res) => {
  try {
    const academyCode = req.user.academyCode;
    const { name, examName, year } = req.body;

    const imageUrl = req.files?.image
      ? `/uploads/champions/${req.files.image[0].filename}`
      : "";

    const videoUrl = req.files?.video
      ? `/uploads/champions/${req.files.video[0].filename}`
      : "";

    const champ = await Champion.create({
      academyCode,
      name,
      examName,
      year,
      imageUrl,
      videoUrl,
    });

    res.json(champ);
  } catch (err) {
    console.error("Error adding champion:", err);
    res.status(500).json({ error: "Error adding champion" });
  }
};

/* ======================================================
   UPDATE CHAMPION
====================================================== */
exports.updateChampion = async (req, res) => {
  try {
    const academyCode = req.user.academyCode;
    const { id } = req.params;
    const { name, examName, year } = req.body;

    const update = { name, examName, year };

    if (req.files?.image) {
      update.imageUrl = `/uploads/champions/${req.files.image[0].filename}`;
    }

    if (req.files?.video) {
      update.videoUrl = `/uploads/champions/${req.files.video[0].filename}`;
    }

    const updated = await Champion.findOneAndUpdate(
      { _id: id, academyCode },
      update,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update champion error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

/* ======================================================
   DELETE CHAMPION
====================================================== */
exports.deleteChampion = async (req, res) => {
  try {
    const academyCode = req.user.academyCode;
    const { id } = req.params;

    await Champion.findOneAndDelete({ _id: id, academyCode });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete champion error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
