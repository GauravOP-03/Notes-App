const express = require("express");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig");
const upload = multer({ storage });
const note = require("../models/notes");
const { verifyToken, verifyUser } = require("../middleware/verify");
const noteAiData = require("../models/noteAiData");
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
      // date: new Date(),
      heading: heading,
      noteBody: noteBody,
      image: [imagePath],
      owner: req.user.userId,
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
    const id = req.user.userId;
    const data = await note
      .find({ owner: id })
      .populate("aiData")
      .select("-__v -owner");
    // console.log(data);
    res.status(200).json({ data });
  } catch (e) {
    res.status(e);
  }
});

router.delete("/:id/delete", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    // console.log(req.params);

    await note.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    res.status(e);
  }
});

router.put(
  "/:id",
  verifyToken,
  verifyUser,
  upload.single("file"),
  async (req, res) => {
    // console.log("Edit request received");
    // console.log(req.file);
    // console.log(req.body);
    try {
      // Safely handle file upload
      const image = req.file?.path || null;
      // console.log("Uploaded image path:", image);

      const { id } = req.params;
      const { heading, noteBody, audioFile, transcribedText } = req.body;

      // Validate required fields
      if (!id || !heading || !noteBody) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Update the note
      const updatedNote = await note.findByIdAndUpdate(
        id,
        {
          // date: new Date(),
          heading,
          noteBody,
          audioFile,
          transcribedText,
          ...(image && { $push: { image } }), // Only push image if it exists
        },
        { runValidators: true, new: true }
      );

      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      // console.log("Updated note:", updatedNote);
      res
        .status(200)
        .json({ message: "Note updated successfully", data: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

router.delete("/:id/image", verifyToken, verifyUser, async (req, res) => {
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
    // console.log(imgNote);
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

router.delete("/:id/voice", verifyToken, verifyUser, async (req, res) => {
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

router.post("/:id/share", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  const { expireInHour } = req.body;
  // console.log(expireInHour);
  const sharedUntil = new Date(Date.now() + expireInHour * 60 * 60 * 1000);
  // console.log(sharedUntil);
  const shareId = require("crypto").randomBytes(8).toString("hex");
  const updatedNote = await note.findByIdAndUpdate(
    id,
    {
      shareId,
      sharedUntil: sharedUntil,
      visibility: "public",
    },
    { new: true },
    { timestamps: false }
  );
  if (!updatedNote) return res.status(400).json({ message: "Notes not Found" });
  // console.log(updatedNote);
  return res.status(200).json({
    message: "shared link generated",
    shareId: updatedNote.shareId,
    sharedUntil: updatedNote.sharedUntil,
    visibility: updatedNote.visibility,
  });
});

router.patch("/:id/share/remove", verifyToken, verifyUser, async (req, res) => {
  // console.log(req.params.id);
  const { id } = req.params;
  const sharedNotes = await note.findByIdAndUpdate(
    id,
    {
      visibility: "private",
    },
    { new: true },
    { timestamps: false }
  );
  if (!sharedNotes) return res.status(400).json({ message: "Notes not Found" });
  // console.log(sharedNotes);
  return res.status(200).json({
    message: "Link Sharing Stopped",
    visibility: sharedNotes.visibility,
  });
});

router.get("/shared/:shareId/", async (req, res) => {
  const { shareId } = req.params;
  // console.log(shareId);
  const sharedNotes = await note
    .findOne({ shareId })
    .select("-_id -__v -owner");
  // console.log(sharedNotes);
  if (!sharedNotes) return res.status(404).json({ message: "Note not found" });
  if (
    sharedNotes.sharedUntil &&
    new Date(sharedNotes.sharedUntil).getTime() < Date.now()
  ) {
    return res.status(410).json({ message: "Sharing Link is expired" });
  }
  if (sharedNotes.visibility === "private") {
    return res
      .status(403)
      .json({ message: "You do not have permission to access this note" });
  }

  return res.json({ message: "Fetched Notes successfully", sharedNotes });
});

router.get("/:id/summarize", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const { summarize } = require("../gemini/gemini");
    const findNotes = await note.findById(id).populate("owner").exec();
    if (!findNotes) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (findNotes.owner._id.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to summarize this note" });
    }
    const noteContent = findNotes.noteBody;
    const summary = await summarize(noteContent);
    // const tag = await tags(noteContent);

    const presentNotes = await noteAiData.findOneAndUpdate(
      { noteId: id },
      { summary },
      { new: true }
    );

    let responseSummary;
    let responseCreatedAt;
    let responseUpdatedAt;

    if (presentNotes) {
      responseSummary = presentNotes.summary;
      responseCreatedAt = presentNotes.createdAt;
      responseUpdatedAt = presentNotes.updatedAt;
    } else {
      const newSummary = new noteAiData({
        summary,
        noteId: id,
      });

      const savedSummary = await newSummary.save();
      responseSummary = savedSummary.summary;
      responseCreatedAt = savedSummary.createdAt;
      responseUpdatedAt = savedSummary.updatedAt;
    }

    res.status(200).json({
      message: "Note summarized successfully",
      summary: responseSummary,
      createdAt: responseCreatedAt,
      updatedAt: responseUpdatedAt,
    });
  } catch (e) {
    console.error("Error summarizing note:", e.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
});

router.get("/:id/tags", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const { tags } = require("../gemini/gemini");
    const findNotes = await note.findById(id).populate("owner").exec();

    if (!findNotes) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (findNotes.owner._id.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this note" });
    }

    const noteContent = findNotes.noteBody;
    const generatedTags = await tags(noteContent);
    const tagArray = generatedTags
      .split(",")
      .map((tag) => tag.trim().toLowerCase());

    const presentNotes = await noteAiData.findOneAndUpdate(
      { noteId: id },
      { tags: tagArray },
      { new: true }
    );

    let tag;

    if (presentNotes) {
      tag = presentNotes.tags;
    } else {
      const tags = new noteAiData({
        tags: tagArray,
        noteId: id,
      });

      const newTag = await tags.save();
      tag = newTag.tags;
    }

    res.status(200).json(tag);

    // const newTags = new noteAiData({
    //   tags: tagArray,
    //   noteId: id,
    // });

    // await newTags.save();

    // res.status(200).json(tagArray);
  } catch (e) {
    console.error("Error generating tags:", e.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
});

router.post(
  "/:id/imageSummarize",
  verifyToken,
  verifyUser,
  async (req, res) => {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "Photo URL is required" });

    try {
      const { summarizeImage } = require("../gemini/gemini");
      const findNotes = await note.findById(id).populate("owner").exec();

      if (!findNotes) {
        return res.status(404).json({ message: "Note not found" });
      }

      // Get the image summary using Gemini
      const summary = await summarizeImage(url);

      // Try to find existing AI data for this note
      let aiDoc = await noteAiData.findOne({ noteId: id });

      if (!aiDoc) {
        // If not found, create a new document
        aiDoc = new noteAiData({
          noteId: id,
          images: [{ url, summary }],
        });
      } else {
        // If found, check if this image URL is already summarized
        const existingImage = aiDoc.images.find((img) => img.url === url);
        if (existingImage) {
          existingImage.summary = summary; // Update summary
        } else {
          aiDoc.images.push({ url, summary }); // Add new image entry
        }
      }

      const saved = await aiDoc.save();
      res.status(200).json({ data: saved.images });
    } catch (e) {
      console.error("Error summarizing image:", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.patch("/:id/pin", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const noteDoc = await note.findById(id);
    if (!noteDoc) {
      return res.status(404).json({ message: "Note not found" });
    }
    const updatedNote = await note.findByIdAndUpdate(
      id,
      { pinned: !noteDoc.pinned },
      { new: true },
      { timestamps: false }
    );
    res.status(200).json({
      message: `Note ${
        updatedNote.pinned ? "pinned" : "unpinned"
      } successfully`,
    });
  } catch (error) {
    console.error("Error pinning note:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/archive", verifyToken, verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const noteDoc = await note.findById(id);
    if (!noteDoc) {
      return res.status(404).json({ message: "Note not found" });
    }
    const updatedNote = await note.findByIdAndUpdate(
      id,
      { archived: !noteDoc.archived },
      { new: true },
      { timestamps: false }
    );
    res.status(200).json({
      message: `Note ${
        updatedNote.archived ? "archived" : "unarchived"
      } successfully`,
    });
  } catch (error) {
    console.error("Error archiving note:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
