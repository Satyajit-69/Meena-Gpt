import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new mongoose.Schema(
  {
    userId: {
      type: String,     // comes from JWT token
      required: true,
    },

    threadId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    // message array
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Thread", ThreadSchema);
