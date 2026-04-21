const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");

const {
  getReview,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const validateReview = require("../middleware/validateReview");

router.get("/:listingId", getReview);
router.post("/:listingId", auth, validateReview, createReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;