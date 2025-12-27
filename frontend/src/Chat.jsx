import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/* ---------- helpers ---------- */
const isSystemError = (content) =>
  typeof content === "string" &&
  content.toLowerCase().includes("failed to generate");

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  /* ---------- auto scroll ---------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  /* ---------- typing effect ---------- */
  useEffect(() => {
    if (reply === null || isSystemError(reply)) {
      setLatestReply(null);
      return;
    }
    if (!prevChats.length) return;

    const words = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats.length, reply]);

  /* ---------- copy ---------- */
  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  /* ---------- markdown ---------- */
  const mdComponents = {
    code: ({ inline, ...props }) => (
      <code
        className={
          inline
            ? "bg-gray-900 px-2 py-1 rounded text-emerald-400 font-mono text-sm border border-gray-700"
            : ""
        }
        {...props}
      />
    ),
    pre: ({ ...props }) => (
      <pre className="bg-gray-900 rounded-xl p-4 overflow-x-auto border border-gray-700 my-3" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-xl font-semibold text-blue-300 mb-2 mt-3" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-lg font-medium text-blue-200 mb-2 mt-3" {...props} />
    ),
    a: ({ ...props }) => (
      <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-3" {...props} />
    ),
  };

  /* ---------- render message ---------- */
  const renderMessage = (chat, i, isLatest = false) => {
    const isUser = chat.role === "user";
    const isError = isSystemError(chat.content);

    /* ---- system error banner ---- */
    if (isError) {
      return (
        <div key={i} className="flex justify-center w-full my-2 animate-fadeIn">
          <div className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/30">
            ⚠️ {chat.content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={i}
        className={`flex w-full ${
          isUser ? "justify-end" : "justify-start"
        } animate-slideIn`}
      >
        <div
          className={`flex items-start gap-3 max-w-[75%] ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          {/* avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isUser
                ? "bg-blue-600"
                : "bg-gradient-to-br from-purple-500 to-pink-600"
            }`}
          >
            <i
              className={`fa-solid ${
                isUser ? "fa-user" : "fa-robot"
              } text-white`}
            />
          </div>

          {/* message */}
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div
              className={`px-5 py-4 rounded-2xl ${
                isUser
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md"
                  : "bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700 rounded-tl-md"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {chat.content}
                </p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={mdComponents}
                  >
                    {isLatest ? latestReply ?? chat.content : chat.content}
                  </ReactMarkdown>

                  {isLatest && latestReply && latestReply !== reply && (
                    <div className="flex gap-1 mt-2">
                      {[0, 150, 300].map((d, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* actions */}
            {!isUser && (
              <div className="flex items-center gap-3 px-2 text-xs">
                <button
                  onClick={() => handleCopy(chat.content, i)}
                  className="text-gray-500 hover:text-blue-400"
                >
                  <i
                    className={`fa-solid ${
                      copiedIndex === i ? "fa-check text-green-400" : "fa-copy"
                    }`}
                  />{" "}
                  {copiedIndex === i ? "Copied" : "Copy"}
                </button>
                <button className="text-gray-500 hover:text-blue-400">
                  <i className="fa-solid fa-thumbs-up" /> Good
                </button>
                <button className="text-gray-500 hover:text-red-400">
                  <i className="fa-solid fa-thumbs-down" /> Bad
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ---------- last assistant safely ---------- */
  const lastAssistantIndex = [...prevChats]
    .map((m, i) => ({ ...m, i }))
    .filter((m) => m.role === "assistant")
    .at(-1)?.i;

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-6 scroll-smooth text-white">
      {newChat && (
        <div className="flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-comments text-white text-2xl" />
          </div>
          <h1 className="text-gray-400">Start a conversation...</h1>
        </div>
      )}

      {prevChats.slice(0, -1).map((chat, i) => renderMessage(chat, i))}

      {lastAssistantIndex !== undefined &&
        renderMessage(prevChats[lastAssistantIndex], lastAssistantIndex, true)}

      <div ref={chatEndRef} />
    </div>
  );
}

export default Chat;
