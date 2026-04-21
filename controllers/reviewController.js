const Listing = require("../models/Listing");
const mongoose = require("mongoose");
const Review = require("../models/Review");

exports.getReview = async (req, res) => {
  try {
    const reviews = await Review.find({
      listing: req.params.listingId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const existing = await Review.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this listing",
      });
    }

    const review = new Review({
      user: req.user.id,
      listing: req.params.listingId,
      rating,
      comment,
    });

    await review.save();

    listing.reviews.push(review._id);
    const stats = await Review.aggregate([
      { $match: { listing: listing._id } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    listing.avgRating = stats[0]?.avg || 0;
    listing.reviewCount = stats[0]?.count || 0;
    await listing.save();

    res.json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 1. DELETE review FIRST
    await review.deleteOne();

    // 🔥 2. REMOVE from listing
    await Listing.findByIdAndUpdate(review.listing, {
      $pull: { reviews: review._id },
    });

    // 🔥 3. RECALCULATE stats
    const stats = await Review.aggregate([
      { $match: { listing: review.listing } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    // 🔥 4. UPDATE listing
    await Listing.findByIdAndUpdate(review.listing, {
      avgRating: stats[0]?.avg || 0,
      reviewCount: stats[0]?.count || 0,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err); // 🔥 add this for debugging
    res.status(500).json({ message: "Delete failed" });
  }
};
