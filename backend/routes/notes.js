const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const note = require("../models/notes");
const verifyToken = require("./verifyToken");
const router = express.Router();

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 }, // Allows only 1 image
  { name: "audioFile", maxCount: 1 }, // Allows only 1 audio file
]);

router.post("/", verifyToken, uploadFields, async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    // console.log(req.user);

    let { heading, noteBody, transcribedText } = req.body;

    // Check if image was uploaded
    const imagePath = req.files?.image?.[0]?.path || null;
    const audioFile = req.files?.audioFile?.[0]?.path || null;

    const data = new note({
      date: new Date(),
      heading: heading,
      noteBody: noteBody,
      image: imagePath,
      owner: req.user.id,
      transcribedText: transcribedText,
      audioFile: audioFile,
    });

    await data.save();
    // console.log(d);
    res.status(201).json({ message: "Note saved successfully" });
  } catch (error) {
    console.error("Error saving note:", error.message);
    res.status(500).json({ message: error });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const id = req.user.id;
    const data = await note
      .find({ owner: id })
      .populate("owner", "email username");
    // console.log(data);
    res.status(200).json({ data });
  } catch (e) {
    res.status(e);
  }
});

router.delete("/:id/delete", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    console.log(req.params);
    if (!id) {
      return res.status(404).json({ message: "Note not Found" });
    }
    await note.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    res.status(e);
  }
});

router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, noteBody } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const d = await note.findByIdAndUpdate(
      id,
      {
        date: new Date(),
        heading,
        noteBody,
        $push: { image: imagePath },
      },
      { runValidators: true }
    );
    console.log(d);
    res.status(200).json({ message: "Note Updated" });
  } catch (e) {
    res.status(e);
  }
});

module.exports = router;
