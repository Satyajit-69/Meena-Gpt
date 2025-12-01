import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

// GET ALL THREADS
router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    return res.json(threads);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// GET SPECIFIC THREAD
router.get("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.json(thread.messages || []);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// DELETE THREAD
router.delete("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete thread" });
  }
});

// MAIN CHAT ROUTE
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    // If thread doesn't exist → create new
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // Gemini AI reply
    const assistantReply = await getGeminiResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.log("Chat Route Error:", err);
    return res.status(500).json({ error: "Chat processing failed" });
  }
});

export default router;
