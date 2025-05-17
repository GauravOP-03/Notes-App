const mongoose = require("mongoose");
const noteAiDataSchema = mongoose.Schema(
  {
    summary: String,
    tags: {
      type: [String],
      enum: [
        "lecture",
        "assignment",
        "important",
        "exam",
        "project",
        "todo",
        "meeting",
        "idea",
        "code",
        "research",
        "summary",
        "quote",
        "personal",
      ],
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
  },
  { timestamps: true }
);

const NoteAiData = mongoose.model("NoteAiData", noteAiDataSchema);

module.exports = NoteAiData;
