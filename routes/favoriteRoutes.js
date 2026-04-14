const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

router.post("/:listingId", auth, toggleFavorite);
router.get("/", auth, getFavorites);

module.exports = router;