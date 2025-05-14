const mongoose = require("mongoose");
const noteSchema = mongoose.Schema(
  {
    heading: String,
    noteBody: String,
    image: { type: [String] },
    audioFile: String,
    transcribedText: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
