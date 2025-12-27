import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import Chat from "./Chat.jsx";
import { ScaleLoader } from "react-spinners";
import Navbar from "./Navbar.jsx";
import botSVG from "./assets/chat-bot-animate.svg";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    setPrevChats,
    currThreadId,
    newChat,
    setNewChat,
  } = useContext(MyContext);

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false); // ✅ NEW
  const [welcomeText, setWelcomeText] = useState("");

  const typewriterRef = useRef(null);
  const inputRef = useRef(null);

  const BASE_URL = "https://meena-gpt-1.onrender.com/api";

  /* ---------- Typewriter ---------- */
  useEffect(() => {
    if (!newChat) {
      setWelcomeText("");
      return;
    }

    const txt = "Welcome to Meena GPT — Get Started With Meena";
    let index = 0;

    clearInterval(typewriterRef.current);
    typewriterRef.current = setInterval(() => {
      setWelcomeText(txt.slice(0, index));
      index++;
      if (index > txt.length) clearInterval(typewriterRef.current);
    }, 35);

    return () => clearInterval(typewriterRef.current);
  }, [newChat]);

  /* ---------- Send message ---------- */
  const sendMessage = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    if (!user?.token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    setPaused(false);
    setNewChat(false);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({ message, threadId: currThreadId }),
      });

      const data = await response.json();
      const reply = data.reply || "No response from server.";

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ]);

      setReply(reply);
      setPrompt("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Chat Error:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ---------- Placeholder text ---------- */
  const getPlaceholder = () => {
    if (paused) return "Generation paused";
    if (loading) return "Meena is thinking…";
    return "Ask Meena anything…";
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-2">
        {newChat ? (
          <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
            <img
              src={botSVG}
              alt="Meena Bot"
              className="w-20 h-20 sm:w-28 sm:h-28 animate-pulse mb-6"
            />

            <h1 className="text-3xl font-bold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 min-h-[4rem]">
              {welcomeText}
            </h1>

            <p className="text-gray-400 text-center mb-8">
              Start a conversation below
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Chat />
          </div>
        )}
      </div>

      {/* LOADING + PAUSE */}
      {loading && (
        <div className="flex items-center justify-center gap-4 py-3 bg-gray-900/60">
          <ScaleLoader color="#60a5fa" height={18} width={3} />

          {/* ⏸️ Pause Button */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="border-t border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end gap-3 bg-gray-800 rounded-3xl p-4 border border-gray-700 shadow-xl">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              placeholder={getPlaceholder()} // ✅ NEW
              rows={1}
              className="flex-1 bg-transparent text-white outline-none resize-none placeholder-gray-500 max-h-32 overflow-y-auto"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-2xl transition active:scale-95"
            >
              ➤
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
