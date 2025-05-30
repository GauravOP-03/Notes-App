const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const note = require("../models/notes");

const verifyToken = (req, res, next) => {
  // console.log(req.cookies);
  const token = req.cookies.token;
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

const verifyUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "Note not Found" });
  }

  const noteToDelete = await note.findById(id).populate("owner").exec();
  if (!noteToDelete) {
    return res.status(404).json({ message: "Note not found" });
  }
  if (noteToDelete.owner._id.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this note" });
  }
  next();
};

module.exports = { verifyToken, verifyUser };
