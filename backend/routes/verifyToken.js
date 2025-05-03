const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// **Protected Route**

module.exports = verifyToken;
