const Listing = require("../models/Listing");
const mongoose = require("mongoose");

exports.getListing = async (req, res) => {
  let listings = await Listing.find({});
  res.json(listings);
};

exports.createListing = async (req, res) => {
  try {
    console.log(req.body)
    const { title, description, price, location, country } = req.body;

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: {
        url: req.file?.path || "",
      },
      owner: req.user.id,
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: newListing,
    });

  } catch (err) {
    console.error(err); // 🔥 important

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.singleListing = async (req, res) => {
  let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
  const listing = await Listing.findById(id);
  res.json(listing);
};

exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    // 🔥 find existing listing
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // 🔥 update basic fields
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.location = req.body.location;
    listing.country = req.body.country;
    console.log(req.file)
    // 🔥 if new image uploaded
    if (req.file) {
      listing.image.url = req.file.path;
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { // To prevent invalid MongoDB queries and avoid server crashes. 
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
