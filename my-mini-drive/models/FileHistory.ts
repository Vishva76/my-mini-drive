import mongoose from "mongoose";

const FileHistorySchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },

    event: {
      type: String,
      enum: [
        "CREATED",
        "RENAMED",
        "MOVED",
        "TAGS_UPDATED",
        "DELETED",
        "RESTORED",
      ],
      required: true,
    },

    meta: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FileHistory ||
  mongoose.model("FileHistory", FileHistorySchema);
