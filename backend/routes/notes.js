const express = require("express");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig");
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

    const newNote = new note({
      date: new Date(),
      heading: heading,
      noteBody: noteBody,
      image: [imagePath],
      owner: req.user.id,
      transcribedText: transcribedText,
      audioFile: audioFile,
    });

    const savedNote = await newNote.save();
    // console.log(d);
    res.status(201).json({
      message: "Note saved successfully",
      data: savedNote,
    });
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
    // console.log(req.params);
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
  console.log("Edit request received");
  console.log(req.file);
  console.log(req.body);
  try {
    // Safely handle file upload
    const image = req.file?.path || null;
    console.log("Uploaded image path:", image);

    const { id } = req.params;
    const { heading, noteBody } = req.body;

    // Validate required fields
    if (!id || !heading || !noteBody) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update the note
    const updatedNote = await note.findByIdAndUpdate(
      id,
      {
        date: new Date(),
        heading,
        noteBody,
        ...(image && { $push: { image } }), // Only push image if it exists
      },
      { runValidators: true, new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    console.log("Updated note:", updatedNote);
    res
      .status(200)
      .json({ message: "Note updated successfully", data: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.delete("/:id/image", verifyToken, async (req, res) => {
  const { img } = req.body;
  if (!img || !img.includes("/upload/"))
    return res.status(400).json({ error: "Invalid Cloudinary URL" });
  const { id } = req.params;
  try {
    const imgNote = await note
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            image: img,
          },
        },
        { new: true }
      )
      .select("image");
    if (!imgNote) return res.status(400).json({ error: "Cant find the Image" });
    console.log(imgNote);
    const imgSplit = img.split("/");
    const folderName = imgSplit[imgSplit.length - 2];
    const imgName = imgSplit[imgSplit.length - 1].split(".")[0];
    // console.log(folderName);
    // console.log(publicId);
    // console.log(imgName);
    const result = await cloudinary.uploader.destroy(
      `${folderName}/${imgName}`
    );
    if (result.result === "ok") {
      return res
        .status(200)
        .json({ message: "Image deleted successfully", data: imgNote });
    } else {
      return res.status(400).json({ message: "Cloudinary deletion failed" });
      // console.log(imgNote.image);
    }
  } catch (e) {
    console.error("Cloudinary Delete Error:", e);
    return res
      .status(500)
      .json({ message: "Server error while deleting image" });
  }
});

router.delete("/:id/voice", verifyToken, async (req, res) => {
  const { voice } = req.body;
  if (!voice || !voice.includes("/upload/"))
    return res.status(400).json({ error: "Invalid Cloudinary URL" });
  const { id } = req.params;
  try {
    const UpdatedNotes = await note.findByIdAndUpdate(
      id,
      { audioFile: null },
      { new: true }
    );
    if (!UpdatedNotes)
      return res.status(400).json({ error: "Cant find the Audio" });
    const voiceSplit = voice.split("/");
    const folderName = voiceSplit[voiceSplit.length - 2];
    const voiceName = voiceSplit[voiceSplit.length - 1];
    const result = await cloudinary.uploader.destroy(
      `${folderName}/${voiceName}`,
      { resource_type: "raw" }
    );
    if (result.result === "ok") {
      return res
        .status(200)
        .json({ message: "Voice deleted successfully", data: UpdatedNotes });
    } else {
      return res.status(400).json({ message: "Cloudinary deletion failed" });
    }
  } catch (e) {
    console.error("Cloudinary Delete Error:", e);
    return res
      .status(500)
      .json({ message: "Server error while deleting voice" });
  }
});

module.exports = router;
