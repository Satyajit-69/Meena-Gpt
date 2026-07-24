import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import Chat from "./Chat.jsx";
import { ScaleLoader } from "react-spinners";
import Navbar from "./Navbar.jsx";
import botSVG from "./assets/chat-bot-animate.svg";
import {
  Lightbulb,
  Code,
  FileText,
  Search,
  Play,
  Pause,
  Ellipsis,
  Send,
} from "lucide-react";

/* ── suggestion chips shown on welcome screen ── */
const SUGGESTIONS = [
  { icon: Lightbulb, label: "Brainstorm ideas" },
  { icon: Code, label: "Write some code" },
  { icon: FileText, label: "Summarize text" },
  { icon: Search, label: "Research a topic" },
];

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
  const [paused, setPaused] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const typewriterRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const BASE_URL = "https://meena-gpt-1.onrender.com/api";
  const MAX_CHARS = 4000;

  /* ── auto-resize textarea ── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [prompt]);

  /* ── typewriter ── */
  useEffect(() => {
    if (!newChat) {
      setWelcomeText("");
      return;
    }
    const txt = "Welcome to Meena GPT";
    let index = 0;
    clearInterval(typewriterRef.current);
    typewriterRef.current = setInterval(() => {
      setWelcomeText(txt.slice(0, index));
      index++;
      if (index > txt.length) clearInterval(typewriterRef.current);
    }, 60);
    return () => clearInterval(typewriterRef.current);
  }, [newChat]);

  /* ── send message ── */
  const sendMessage = async (overridePrompt) => {
    const message = (overridePrompt ?? prompt).trim();
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
      setCharCount(0);
      textareaRef.current?.focus();
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setPrompt(val);
      setCharCount(val.length);
    }
  };

  const handleSuggestion = (label) => {
    setPrompt(label);
    setCharCount(label.length);
    textareaRef.current?.focus();
  };

  const canSend = !loading && prompt.trim().length > 0;
  const nearLimit = charCount > MAX_CHARS * 0.8;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg-deep:    #0a0c12;
          --bg-base:    #0f1117;
          --bg-surface: #161921;
          --bg-raised:  #1c202b;
          --border:     rgba(255,255,255,0.07);
          --border-hi:  rgba(255,255,255,0.13);
          --accent:     #4f7cff;
          --accent-glow:#4f7cff40;
          --accent2:    #a78bfa;
          --text-1:     #f0f2ff;
          --text-2:     #8b92a8;
          --text-3:     #4a5068;
        }

        .cw-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .cw-root { background: var(--bg-deep); }

        /* scrollbar */
        .cw-scroll::-webkit-scrollbar { width: 4px; }
        .cw-scroll::-webkit-scrollbar-track { background: transparent; }
        .cw-scroll::-webkit-scrollbar-thumb { background: var(--bg-raised); border-radius: 2px; }

        /* welcome text font */
        .welcome-title { font-family: 'Syne', sans-serif; }

        /* glow on focus */
        .input-box-focused { box-shadow: 0 0 0 1px var(--accent), 0 0 24px var(--accent-glow); }
        .input-box { transition: box-shadow 0.2s ease, border-color 0.2s ease; }

        /* chip hover */
        .chip { transition: background 0.15s, border-color 0.15s, transform 0.15s; }
        .chip:hover { transform: translateY(-1px); }

        /* send btn pulse when can send */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 8px var(--accent-glow); }
          50%       { box-shadow: 0 0 20px var(--accent-glow); }
        }
        .btn-ready { animation: glow-pulse 2s infinite; }

        /* loading bar */
        @keyframes thinking-bar {
          0%   { width: 0%; opacity: 1; }
          60%  { width: 85%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .thinking-bar { animation: thinking-bar 2.5s ease-in-out infinite; }

        /* fade up */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.4s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.4s 0.4s ease both; }

        /* bot SVG float */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .bot-float { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      <div className="cw-root flex flex-col h-screen overflow-hidden">

    

        {/* ── main scroll area ── */}
        <div className="cw-scroll flex-1 overflow-y-auto relative">

          {/* subtle grid background */}
          <div
            className="pointer-events-none fixed inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(var(--border-hi) 1px, transparent 1px), linear-gradient(90deg, var(--border-hi) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {newChat ? (
            /* ── welcome ── */
            <div className="flex flex-col items-center justify-center min-h-full py-16 px-6 gap-8">

              <div className="bot-float fade-up">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                      boxShadow: "0 16px 48px var(--accent-glow)",
                    }}
                  >
                    <img src={botSVG} alt="Meena Bot" className="w-16 h-16 object-contain" />
                  </div>
                  {/* online dot */}
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ background: "#22c55e", borderColor: "var(--bg-deep)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75 absolute" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white relative" />
                  </span>
                </div>
              </div>

              <div className="text-center fade-up-1">
                <h1
                  className="welcome-title text-4xl sm:text-5xl font-bold mb-3 min-h-[3.5rem]"
                  style={{ color: "var(--text-1)" }}
                >
                  {welcomeText}
                  <span className="animate-pulse" style={{ color: "var(--accent)" }}>|</span>
                </h1>
                <p className="text-base" style={{ color: "var(--text-2)" }}>
                  Get started with a question below
                </p>
              </div>

              {/* suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2.5 max-w-lg fade-up-2">
                {SUGGESTIONS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => handleSuggestion(label)}
                    className="chip flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-hi)",
                      color: "var(--text-2)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "var(--bg-raised)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--text-1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "var(--bg-surface)";
                      e.currentTarget.style.borderColor = "var(--border-hi)";
                      e.currentTarget.style.color = "var(--text-2)";
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              <Chat />
            </div>
          )}
        </div>

        {/* ── thinking indicator ── */}
        {loading && (
          <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
            {/* thin progress bar */}
            <div className="relative h-0.5 overflow-hidden" style={{ background: "var(--bg-raised)" }}>
              <div
                className="thinking-bar absolute left-0 top-0 h-full rounded-full"
                style={{ background: `linear-gradient(90deg, var(--accent), var(--accent2))` }}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <ScaleLoader color="var(--accent)" height={14} width={2.5} margin={2} />
                <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  Meena is thinking…
                </span>
              </div>
              <button
                onClick={() => setPaused((p) => !p)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                style={{
                  background: paused ? "var(--accent)" : "var(--bg-raised)",
                  color: paused ? "#fff" : "var(--text-2)",
                  border: "1px solid var(--border-hi)",
                }}
              >
                {paused ? (
                  <Play className="w-2.5 h-2.5" />
                ) : (
                  <Pause className="w-2.5 h-2.5" />
                )}
                {paused ? "Resume" : "Pause"}
              </button>
            </div>
          </div>
        )}

        {/* ── input area ── */}
        <div style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-3xl mx-auto px-4 pt-3 pb-4">

            <div
              className={`input-box flex items-end gap-3 rounded-2xl px-4 py-3 ${inputFocused ? "input-box-focused" : ""}`}
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${inputFocused ? "var(--accent)" : "var(--border-hi)"}`,
              }}
            >
              {/* textarea */}
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                disabled={loading}
                placeholder={paused ? "Generation paused…" : loading ? "Meena is thinking…" : "Ask Meena anything…"}
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
                style={{
                  color: "var(--text-1)",
                  caretColor: "var(--accent)",
                  maxHeight: "160px",
                  overflowY: "auto",
                  // placeholder color via CSS var isn't possible inline, handled in style tag
                }}
              />

              {/* right controls */}
              <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
                {/* char count */}
                {charCount > 0 && (
                  <span
                    className="text-[10px] tabular-nums"
                    style={{ color: nearLimit ? "#f59e0b" : "var(--text-3)" }}
                  >
                    {charCount}/{MAX_CHARS}
                  </span>
                )}

                {/* send */}
                <button
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${canSend ? "btn-ready" : ""}`}
                  style={{
                    background: canSend
                      ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                      : "var(--bg-raised)",
                    color: canSend ? "#fff" : "var(--text-3)",
                    border: "none",
                    cursor: canSend ? "pointer" : "not-allowed",
                  }}
                >
                  {loading ? (
                    <Ellipsis className="w-3.5 h-3.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* footer hint */}
            <p className="text-center mt-2 text-[11px]" style={{ color: "var(--text-3)" }}>
              <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "var(--bg-raised)", color: "var(--text-3)", border: "1px solid var(--border-hi)" }}>Enter</kbd>
              {" "}to send · {" "}
              <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "var(--bg-raised)", color: "var(--text-3)", border: "1px solid var(--border-hi)" }}>Shift+Enter</kbd>
              {" "}for new line
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default ChatWindow;