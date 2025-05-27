const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
require("dotenv").config();
const admin = require("../FirebaseAdmin");
const router = express.Router();
const verifyToken = require("./verifyToken");
const {
  registerUserSchema,
  loginUserSchema,
} = require("zod-schemas/dist/schema");

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  // Validate input
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });
  }
  try {
    const findUser = await user.findOne({ email });
    // console.log(findUser);
    if (findUser) {
      return res.status(409).json({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      provider: "Email",
    });
    await newUser.save();
    // console.log(d);

    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  // Validate input
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });

  try {
    const findUser = await user.findOne({ email });
    if (!findUser) return res.status(400).json({ message: "User not found" });
    if (findUser && findUser.provider === "Google") {
      return res.status(400).json({
        message: "User logged in through Google, please use Google login",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const payload = {
      userId: findUser.id,
      email: findUser.email,
      avatarUrl: findUser.avatarUrl,
      username: findUser.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    // console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });
    // console.log("login cookie", req.cookies);
    // console.log("Setting cookie:", token);
    // console.log("Cookie headers:", res.getHeaders());
    // console.log("Cookies in request:", req.cookies.token);

    res.json({ message: "User logged in successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  // console.log(token)
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // console.log(decoded);
    const { name, picture, email, uid } = decoded;
    const existingUser = await user.findOne({ email }).exec();
    if (existingUser && existingUser.provider === "Email")
      return res
        .status(409)
        .json({ message: "User already registered through Email" });

    let googleUser = await user.findOne({ firebaseUid: uid }).exec();

    if (!googleUser) {
      try {
        googleUser = await user.create({
          firebaseUid: uid,
          email,
          username: name,
          avatarUrl: picture,
          provider: "Google",
        });
      } catch (createError) {
        console.error("User creation error:", createError);
        return res.status(500).json({
          message: "Error creating user account",
        });
      }
    }
    const jwtToken = jwt.sign(
      {
        userId: googleUser._id,
        email: googleUser.email,
        avatarUrl: googleUser.avatarUrl,
        username: googleUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });

    // const userData = {
    //   _id: googleUser._id,
    //   username: googleUser.username,
    //   email: googleUser.email,
    //   avatarUrl: googleUser.avatarUrl,
    // };
    return res.json({
      message: "User logged in successfully!",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Server error during Google authentication" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  // console.log(req.user);
  const { userId } = req.user;
  const existingUser = await user.findById(userId).exec();
  // console.log(existingUser);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userData } = existingUser._doc;
  res.json(userData);
  // user
  //   .findById(userId)
  //   .then((userData) => {
  //     console.log(userData)
  //     if (!userData) return res.status(404).json({ message: "User not found" });
  //     const { password, ...others } = userData._doc;
  //     res.json(others);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ message: "Server error" });
  //   });
});

module.exports = router;
