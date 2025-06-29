const mongoose = require("mongoose");
const noteAiDataSchema = mongoose.Schema(
  {
    summary: String,
    tags: {
      type: [String],
      default: [],
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        summary: {
          type: String,
          default: "",
        },
      },
    ],
  },

  { timestamps: true }
);

const NoteAiData = mongoose.model("NoteAiData", noteAiDataSchema);

module.exports = NoteAiData;
