import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    originalName: String,

    path: {
      type: String,
      required: true,
    },

    mimeType: String,
    size: Number,

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    tags: [
      {
        type: String,
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.File ||
  mongoose.model("File", FileSchema);
