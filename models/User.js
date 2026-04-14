const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isGoogleUser: {
    type: Boolean,
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser;
    },
  },

  name: String,
  avatar: String,

  
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
