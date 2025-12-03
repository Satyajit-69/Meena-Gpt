import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import { ScaleLoader } from "react-spinners";
import botSVG from "./assets/chat-bot-animate.svg";
import Navbar from "./Navbar.jsx";
function ChatWindow() {
  const { prompt, setPrompt, setReply, setPrevChats, currThreadId, newChat, setNewChat } = useContext(MyContext);
  
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const typewriterRef = useRef(null);

  const BASE_URL = "http://localhost:8000/api";

  // Typewriter effect for welcome message
  useEffect(() => {
    if (!newChat) {
      setWelcomeText("");
      return;
    }

    const fullText = "Welcome to Meena GPT — Get Started With Meena";
    let index = 0;

    clearInterval(typewriterRef.current);
    typewriterRef.current = setInterval(() => {
      setWelcomeText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(typewriterRef.current);
    }, 35);

    return () => clearInterval(typewriterRef.current);
  }, [newChat]);

  // Send message to API
  const sendMessage = async () => {
    const message = prompt.trim();
    if (!message) return;

    setLoading(true);
    setNewChat(false);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId: currThreadId }),
      });

      const data = await response.json();
      const reply = data.reply || "No response from server.";

      // Update chat history
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ]);

      setReply(reply);
      setPrompt("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-950 relative">
      
      {/* Top Navigation Bar */}
       <Navbar />

      {/* Profile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 right-6 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 animate-shimmer bg-[length:200%_100%]">
            <p className="text-white font-semibold">Satyajit Sahoo</p>
            <p className="text-gray-200 text-xs">satyajitsahoo@gmail.com</p>
          </div>
          
          <MenuItem icon="fa-gear" text="Settings" />
          <MenuItem icon="fa-crown" text="Upgrade to Pro" badge="NEW" />
          <MenuItem icon="fa-moon" text="Dark Mode" toggle />
          <div className="border-t border-gray-700 my-1" />
          <MenuItem icon="fa-arrow-right-from-bracket" text="Log Out" danger />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {newChat ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeIn">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
              <img src={botSVG} className="w-64 h-64 relative z-10" alt="Bot" />
            </div>

            <h2 className="text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              {welcomeText}
              <span className="border-r-2 border-blue-500 animate-pulse ml-1" />
            </h2>

            <p className="text-gray-400 text-base max-w-md mb-8 animate-fadeInDelay">
              Start a conversation below or explore our powerful AI features
            </p>

            {/* Quick Suggestions */}
            <div className="grid grid-cols-2 gap-3 max-w-2xl animate-fadeInDelay2">
              {["Write a poem", "Explain quantum physics", "Create a business plan", "Debug my code"].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(suggestion)}
                  className="group px-4 py-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-xl text-gray-300 text-sm transition-all hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative flex items-center justify-center">
                    <i className="fa-solid fa-lightbulb text-yellow-500 mr-2 group-hover:animate-bounce" />
                    {suggestion}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Messages
          <Chat />
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-3 bg-gray-900/50">
          <ScaleLoader color="#3b82f6" height={20} />
        </div>
      )}

      {/* Input Section */}
      <div className="px-4 pb-6 pt-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-2xl px-5 py-3 shadow-2xl hover:border-blue-500 transition-all focus-within:border-blue-500 focus-within:shadow-blue-500/20">
            
            <button className="text-gray-400 hover:text-white transition-colors mr-3">
              <i className="fa-solid fa-paperclip text-lg" />
            </button>

            <input
              type="text"
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !prompt.trim()}
              className="ml-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              <i className="fa-solid fa-paper-plane text-white text-sm" />
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-2">
            <i className="fa-solid fa-shield-halved" />
            SigmaGPT can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDelay {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInDelay { animation: fadeInDelay 0.6s ease-out 0.3s backwards; }
        .animate-fadeInDelay2 { animation: fadeInDelay 0.6s ease-out 0.5s backwards; }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
        .animate-gradient { 
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Menu Item Component
function MenuItem({ icon, text, badge, toggle, danger }) {
  return (
    <div className={`px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all ${
      danger ? "text-red-400 hover:bg-red-500/10" : "text-gray-300 hover:bg-gray-700"
    }`}>
      <div className="flex items-center gap-3">
        <i className={`fa-solid ${icon} w-4`} />
        <span className="font-medium">{text}</span>
      </div>
      {badge && <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">{badge}</span>}
      {toggle && <div className="w-10 h-5 bg-gray-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" /></div>}
    </div>
  );
}

export default ChatWindow;