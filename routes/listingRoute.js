const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");
const upload = require("../middleware/upload");
const {
  createListing,
  getListing,
  singleListing,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");
const validateListing = require("../middleware/validateListing");

router.get("/", getListing);
router.post("/", auth,  upload.single("image"),validateListing,createListing);
router.get("/:id", singleListing);
router.put("/:id", auth, isOwner, upload.single("image"), updateListing);
router.delete("/:id", auth, isOwner, deleteListing);
module.exports = router;
