const mongoose = require("mongoose");
const noteSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  heading: String,
  noteBody: String,
  image: { type: [String], default: [] },
  audioFile: String,
  transcribedText: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
