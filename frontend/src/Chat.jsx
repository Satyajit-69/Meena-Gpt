import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/* ─── helpers ─────────────────────────────────────────────────── */
const isSystemError = (content) =>
  typeof content === "string" &&
  content.toLowerCase().includes("failed to generate");

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ─── code block with its own copy btn ────────────────────────── */
function CodeBlock({ children, ...props }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = () => {
    const text = codeRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1
                   rounded-md text-xs font-medium
                   bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 hover:text-white
                   opacity-0 group-hover:opacity-100
                   transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
      >
        <i className={`fa-solid ${copied ? "fa-check text-emerald-400" : "fa-copy"}`} />
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        className="bg-gray-950 rounded-xl p-4 overflow-x-auto border border-gray-700/60 text-sm leading-relaxed"
        {...props}
      >
        <code ref={codeRef}>{children}</code>
      </pre>
    </div>
  );
}

/* ─── streaming cursor ─────────────────────────────────────────── */
function StreamingCursor() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-0.5 align-middle">
      {[0, 120, 240].map((d, i) => (
        <span
          key={i}
          className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: `${d}ms`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}

/* ─── main component ───────────────────────────────────────────── */
function Chat() {
  const { newChat, prevChats, reply, onRegenerate } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [timestamps] = useState(() => new Map());
  const [, forceUpdate] = useState(0);
  const chatEndRef = useRef(null);
  const isStreaming = useRef(false);

  /* auto-scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  /* assign timestamps to new messages */
  useEffect(() => {
    prevChats.forEach((_, i) => {
      if (!timestamps.has(i)) {
        timestamps.set(i, new Date());
        forceUpdate((n) => n + 1);
      }
    });
  }, [prevChats]);

  /* typing effect */
  useEffect(() => {
    if (reply === null || isSystemError(reply)) {
      setLatestReply(null);
      isStreaming.current = false;
      return;
    }
    if (!prevChats.length) return;

    isStreaming.current = true;
    const words = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      setLatestReply(words.slice(0, idx).join(" "));
      if (idx >= words.length) {
        clearInterval(interval);
        isStreaming.current = false;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [prevChats.length, reply]);

  /* copy whole message */
  const handleCopy = useCallback((content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  /* markdown components */
  const mdComponents = {
    code({ inline, className, children, ...props }) {
      if (inline) {
        return (
          <code
            className="bg-gray-900 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[0.82em] border border-gray-700/60"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    pre({ children }) {
      return <>{children}</>;
    },
    h1: ({ ...props }) => (
      <h1 className="text-2xl font-bold text-white mb-3 mt-4 border-b border-gray-700 pb-1" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-xl font-semibold text-blue-300 mb-2 mt-4" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-base font-semibold text-blue-200 mb-1.5 mt-3" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc list-inside space-y-1 my-2 text-gray-200" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal list-inside space-y-1 my-2 text-gray-200" {...props} />
    ),
    li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
    p: ({ ...props }) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
    a: ({ ...props }) => (
      <a
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-4 border-blue-500/60 pl-4 italic text-gray-400 my-3 bg-blue-500/5 py-2 rounded-r-lg"
        {...props}
      />
    ),
    table: ({ ...props }) => (
      <div className="overflow-x-auto my-3">
        <table className="text-sm border-collapse w-full" {...props} />
      </div>
    ),
    th: ({ ...props }) => (
      <th className="border border-gray-700 bg-gray-800 px-3 py-2 text-left text-blue-200 font-semibold" {...props} />
    ),
    td: ({ ...props }) => (
      <td className="border border-gray-700/60 px-3 py-1.5 text-gray-300" {...props} />
    ),
    hr: () => <hr className="border-gray-700 my-4" />,
  };

  /* ── find last assistant index ── */
  const lastAssistantIndex = [...prevChats]
    .map((m, i) => ({ ...m, i }))
    .filter((m) => m.role === "assistant")
    .at(-1)?.i;

  /* ── render a single message ── */
  const renderMessage = (chat, i, isLatest = false) => {
    const isUser = chat.role === "user";
    const isError = isSystemError(chat.content);
    const ts = timestamps.get(i);
    const streaming = isLatest && isStreaming.current;
    const displayContent = isLatest ? (latestReply ?? chat.content) : chat.content;

    if (isError) {
      return (
        <div key={i} className="flex justify-center w-full my-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/25 backdrop-blur-sm">
            <i className="fa-solid fa-triangle-exclamation" />
            {chat.content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={i}
        className={`flex w-full ${isUser ? "justify-end" : "justify-start"} group`}
        style={{ animation: "slideUp 0.25s ease forwards" }}
      >
        <div className={`flex items-end gap-2.5 max-w-[78%] ${isUser ? "flex-row-reverse" : ""}`}>

          {/* avatar */}
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-lg mb-0.5
              ${isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-700"
                : "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600"
              }`}
          >
            <i className={`fa-solid ${isUser ? "fa-user" : "fa-robot"} text-white`} style={{ fontSize: "0.7rem" }} />
          </div>

          {/* bubble + meta */}
          <div className={`flex flex-col gap-1.5 min-w-0 flex-1 ${isUser ? "items-end" : "items-start"}`}>

            {/* name + time */}
            <div className={`flex items-center gap-2 px-1 text-[11px] text-gray-500 ${isUser ? "flex-row-reverse" : ""}`}>
              <span className="font-medium text-gray-400">{isUser ? "You" : "Assistant"}</span>
              {ts && <span>{formatTime(ts)}</span>}
              {streaming && (
                <span className="text-blue-400 text-[10px] animate-pulse font-medium tracking-wide">
                  ● LIVE
                </span>
              )}
            </div>

            {/* bubble */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed
                ${isUser
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                  : "bg-gray-800/90 border border-gray-700/60 text-gray-100 rounded-bl-sm backdrop-blur-sm"
                }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{chat.content}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={mdComponents}>
                    {displayContent}
                  </ReactMarkdown>
                  {streaming && <StreamingCursor />}
                </div>
              )}
            </div>

            {/* action bar — visible on hover */}
            {!isUser && (
              <div
                className="flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              >
                <ActionBtn
                  icon={copiedIndex === i ? "fa-check" : "fa-copy"}
                  label={copiedIndex === i ? "Copied" : "Copy"}
                  onClick={() => handleCopy(chat.content, i)}
                  active={copiedIndex === i}
                  activeColor="text-emerald-400"
                />
                <ActionBtn icon="fa-thumbs-up" label="Good" hoverColor="hover:text-blue-400" />
                <ActionBtn icon="fa-thumbs-down" label="Bad" hoverColor="hover:text-red-400" />
                {isLatest && typeof onRegenerate === "function" && (
                  <ActionBtn
                    icon="fa-rotate-right"
                    label="Regenerate"
                    onClick={onRegenerate}
                    hoverColor="hover:text-violet-400"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── welcome screen ── */
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6 animate-fadeIn select-none">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-900/40">
          <i className="fa-solid fa-robot text-white text-3xl" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-white text-xl font-semibold">How can I help you today?</h2>
        <p className="text-gray-500 text-sm">Ask me anything — I'm ready.</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center max-w-sm">
        {["Explain a concept", "Write some code", "Summarize text", "Brainstorm ideas"].map((s) => (
          <span
            key={s}
            className="px-3 py-1.5 rounded-full text-xs border border-gray-700 text-gray-400 bg-gray-800/50 cursor-default"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <div className="w-full h-full overflow-y-auto scroll-smooth text-white">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5 min-h-full">

          {newChat
            ? <WelcomeScreen />
            : <>
                {prevChats.slice(0, -1).map((chat, i) => renderMessage(chat, i))}

                {lastAssistantIndex !== undefined &&
                  renderMessage(prevChats[lastAssistantIndex], lastAssistantIndex, true)}
              </>
          }

          <div ref={chatEndRef} className="h-4" />
        </div>
      </div>
    </>
  );
}

/* ─── tiny reusable action button ─────────────────────────────── */
function ActionBtn({ icon, label, onClick, active, activeColor = "", hoverColor = "hover:text-blue-400" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium
        transition-all duration-150 border border-transparent
        hover:bg-gray-700/60 hover:border-gray-600/40
        ${active ? activeColor : `text-gray-500 ${hoverColor}`}`}
    >
      <i className={`fa-solid ${icon}`} />
      {label}
    </button>
  );
}

export default Chat;