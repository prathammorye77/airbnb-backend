const Listing = require("../models/Listing");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // 🔥 CHECK OWNER
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized",
      });
    }

    next(); // ✅ allow

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};