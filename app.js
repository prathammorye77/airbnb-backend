require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/airdb";
const User = require("./models/User");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const MONGO_URL = process.env.MONGO_URL;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoute");

app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        isGoogleUser: true, // 🔥 MUST ADD
      });
    }

    // Create your JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ user, token: jwtToken });
  } catch (err) {
    console.log("ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ message: "Google login failed" });
  }
});

app.use("/", authRoutes);
app.use("/listings", listingRoutes);
app.use("/favorites", require("./routes/favoriteRoutes"));

app.listen(process.env.PORT, () => {
  console.log("app is listening");
});
