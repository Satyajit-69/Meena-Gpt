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
  const [welcomeText, setWelcomeText] = useState("");
  const typewriterRef = useRef(null);
  const inputRef = useRef(null);
  const BASE_URL = "https://meena-gpt-1.onrender.com/api";

  // Typewriter effect
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

  // Send message
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

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-2">
        {newChat ? (
          <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
            {/* Bot avatar */}
            <div className="mb-6 sm:mb-8">
              <img
                src={botSVG}
                alt="Meena Bot"
                className="w-20 h-20 sm:w-28 sm:h-28 animate-pulse"
              />
            </div>

            {/* Welcome text */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 min-h-[3rem] sm:min-h-[4rem]">
              {welcomeText}
            </h1>
            <p className="text-gray-400 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
              Start a conversation below
            </p>

            {/* Suggestion grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
              {[
                { text: "Write a poem", icon: "✍️" },
                { text: "Explain quantum physics", icon: "🔬" },
                { text: "Create a business plan", icon: "💼" },
                { text: "Debug my code", icon: "🐛" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(item.text)}
                  className="group px-4 py-4 sm:py-5 bg-gray-800/50 hover:bg-gray-700/70 rounded-2xl text-gray-300 hover:text-white transition-all duration-200 text-left border border-gray-700/50 hover:border-gray-600 active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-sm sm:text-base font-medium">
                      {item.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-4">
            <Chat />
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-3 bg-gray-900/50">
          <ScaleLoader color="#60a5fa" height={20} width={3} />
        </div>
      )}

      {/* Input area - fixed at bottom */}
      <div className="border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex items-end gap-2 sm:gap-3 bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl border border-gray-700">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-transparent text-white outline-none resize-none placeholder-gray-500 text-sm sm:text-base max-h-32 overflow-y-auto disabled:opacity-50"
              style={{
                minHeight: "24px",
                lineHeight: "24px",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !prompt.trim()}
              className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-200 disabled:cursor-not-allowed active:scale-95 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-gray-500 text-center mt-2 px-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;