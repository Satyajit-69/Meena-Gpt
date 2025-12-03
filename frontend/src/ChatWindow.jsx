import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import Chat from "./Chat.jsx";
import { ScaleLoader } from "react-spinners";
import Navbar from "./Navbar.jsx";
import botSVG from "./assets/chat-bot-animate.svg";

function ChatWindow() {
  const { prompt, setPrompt, setReply, setPrevChats, currThreadId, newChat, setNewChat } =
    useContext(MyContext);

  const { user } = useAuth(); // ⬅️ Access token here

  const [loading, setLoading] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const typewriterRef = useRef(null);

const BASE_URL = "https://meena-gpt-1.onrender.com/api";

  // ---------------------------
  // TYPEWRITER WELCOME
  // ---------------------------
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

  // ---------------------------
  // SEND MESSAGE
  // ---------------------------
  const sendMessage = async () => {
    const message = prompt.trim();
    if (!message) return;

    if (!user?.token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    setNewChat(false);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token, // ⬅️ SEND TOKEN
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
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter Key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="flex flex-col w-full h-full bg-gray-950">

      <Navbar />

      <div className="flex-1 overflow-hidden">
        {newChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <img src={botSVG} className="w-64 h-64 mb-6" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              {welcomeText}
            </h2>

            <p className="text-gray-400 mt-3 mb-6">Start a conversation below</p>

            <div className="grid grid-cols-2 gap-3">
              {["Write a poem", "Explain quantum physics", "Create a business plan", "Debug my code"].map(
                (s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <Chat />
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-3 bg-gray-900/50">
          <ScaleLoader color="#3b82f6" height={20} />
        </div>
      )}

      <div className="px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-2xl px-5 py-3">
            <input
              type="text"
              value={prompt}
              placeholder="Ask anything..."
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1 bg-transparent text-white outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !prompt.trim()}
              className="ml-3 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane text-white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
