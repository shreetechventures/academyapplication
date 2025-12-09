const Champion = require("../models/Champion");

exports.getChampions = async (req, res) => {
  try {
    const { academyCode } = req.params;

    const champions = await Champion.find({ academyCode })
      .sort({ createdAt: -1 }); // newest first

    // Group by Year
    const grouped = {};

    champions.forEach((c) => {
      const year = new Date(c.createdAt).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(c);
    });

    res.json(grouped);
  } catch (err) {
    console.error("Error loading champions:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.addChampion = async (req, res) => {
  try {
    const { academyCode } = req.params;
    const { name, examName, year } = req.body; // ⭐ ADD year

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
      year,          // ⭐ ADD THIS
      imageUrl,
      videoUrl,
    });

    res.json(champ);
  } catch (err) {
    res.status(500).json({ error: "Error adding champion" });
  }
};


exports.updateChampion = async (req, res) => {
  try {
    const { academyCode, id } = req.params;
    const { name, examName, year } = req.body; // ⭐ ADD year

    const update = { name, examName, year };  // ⭐ include year

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
    res.status(500).json({ error: "Update failed" });
  }
};


exports.deleteChampion = async (req, res) => {
  try {
    const { id, academyCode } = req.params;

    await Champion.findOneAndDelete({ _id: id, academyCode });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
