const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    heading: String,
    noteBody: String,
    image: [String],
    audioFile: String,
    transcribedText: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareId: String,
    sharedUntil: Date,
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  { timestamps: true }
);

// Virtual field to populate NoteAiData
noteSchema.virtual("aiData", {
  ref: "NoteAiData",
  localField: "_id",
  foreignField: "noteId",
  justOne: true, // Assuming one-to-one relationship
});

// Ensure virtual fields are serialized
noteSchema.set("toObject", { virtuals: true });
noteSchema.set("toJSON", { virtuals: true });

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
