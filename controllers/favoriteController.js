const User = require("../models/User");

// 🔥 Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    const user = await User.findById(userId);

    const isFav = user.favorites.includes(listingId);

    if (isFav) {
      // ❌ remove
      user.favorites.pull(listingId);
    } else {
      // ✅ add
      user.favorites.push(listingId);
    }

    await user.save();

    res.json({
      success: true,
      message: isFav ? "Removed from favorites" : "Added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};