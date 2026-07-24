import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import { v1 as uuidv1 } from "uuid";
import {
  Plus, MessageSquare, Trash2, Edit2, Check, X,
  User, Settings, LogOut, ChevronDown, Sparkles
} from "lucide-react";
import logo from "./assets/ChatBot.png";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const {
    allThreads, setAllThreads, currThreadId,
    setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats
  } = useContext(MyContext);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const BASE_URL = "https://meena-gpt-1.onrender.com/api";

  /* ── fetch threads ── */
  const getAllThreads = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`${BASE_URL}/threads`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllThreads(data.map((t) => ({ threadId: t.threadId, title: t.title })));
      }
    } catch (err) {
      console.log("Fetch Threads Error:", err);
    }
  };

  useEffect(() => { getAllThreads(); }, [currThreadId, isAuthenticated]);

  /* ── new chat ── */
  const createNewChat = () => {
    if (!isAuthenticated) return navigate("/login");
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  /* ── load thread ── */
  const changeThread = async (id) => {
    if (!isAuthenticated) return navigate("/login");
    setCurrThreadId(id);
    try {
      const res = await fetch(`${BASE_URL}/threads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("Load Thread Error:", err);
    }
  };

  /* ── delete ── */
  const deleteThread = async (threadId) => {
    setDeletingId(threadId);
    setTimeout(async () => {
      try {
        await fetch(`${BASE_URL}/threads/${threadId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
        if (threadId === currThreadId) createNewChat();
      } catch (err) {
        console.log("Delete Error:", err);
      } finally {
        setDeletingId(null);
      }
    }, 300);
  };

  /* ── save edit ── */
  const saveEdit = (threadId) => {
    setAllThreads((prev) =>
      prev.map((t) => t.threadId === threadId ? { ...t, title: editTitle } : t)
    );
    setEditingId(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .sb-root {
          font-family: 'DM Sans', sans-serif;
          --sb-bg:      #0c0e16;
          --sb-surface: #13151f;
          --sb-raised:  #1a1d2a;
          --sb-border:  rgba(255,255,255,0.07);
          --sb-border-hi: rgba(255,255,255,0.12);
          --accent:     #4f7cff;
          --accent-dim: rgba(79,124,255,0.15);
          --accent2:    #a78bfa;
          --text-1:     #eef0fb;
          --text-2:     #7b82a0;
          --text-3:     #3d4259;
          --danger:     #f87171;
          background: var(--sb-bg);
          color: var(--text-1);
        }

        .sb-scroll::-webkit-scrollbar { width: 3px; }
        .sb-scroll::-webkit-scrollbar-track { background: transparent; }
        .sb-scroll::-webkit-scrollbar-thumb { background: var(--sb-raised); border-radius: 2px; }

        .sb-thread {
          transition: background 0.15s, opacity 0.3s, transform 0.3s;
          cursor: pointer;
        }
        .sb-thread:hover { background: var(--sb-surface); }
        .sb-thread.active {
          background: var(--accent-dim);
          border-left: 2px solid var(--accent);
        }
        .sb-thread.deleting { opacity: 0; transform: translateX(-12px); }

        .sb-new-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          transition: opacity 0.2s, transform 0.15s;
        }
        .sb-new-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .sb-new-btn:active { transform: scale(0.97); }

        .profile-menu {
          animation: popUp 0.18s ease forwards;
        }
        @keyframes popUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-icon-btn {
          opacity: 0;
          transition: opacity 0.15s, color 0.15s;
        }
        .sb-thread:hover .sb-icon-btn { opacity: 1; }
      `}</style>

      <section className="sb-root flex flex-col h-screen w-64 flex-shrink-0">

        {/* ── header ── */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid var(--sb-border)" }}>
          
          <button
            onClick={createNewChat}
            className="sb-new-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Chat
          </button>
        </div>

        {/* ── thread list ── */}
        <div className="sb-scroll flex-1 overflow-y-auto px-2 py-3">
          <div
            className="text-[10px] font-semibold uppercase tracking-widest px-3 pb-2"
            style={{ color: "var(--text-3)" }}
          >
            Recent
          </div>

          {!isAuthenticated ? (
            <p className="px-3 text-xs" style={{ color: "var(--text-2)" }}>
              Please login to see your chats.
            </p>
          ) : allThreads.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2" style={{ color: "var(--text-3)" }}>
              <MessageSquare size={28} strokeWidth={1.2} />
              <p className="text-xs">No conversations yet</p>
            </div>
          ) : (
            allThreads.map((thread) => {
              const isActive = thread.threadId === currThreadId;
              const isDeleting = deletingId === thread.threadId;

              return (
                <div
                  key={thread.threadId}
                  onClick={() => changeThread(thread.threadId)}
                  className={`sb-thread group flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 ${isActive ? "active" : ""} ${isDeleting ? "deleting" : ""}`}
                >
                  <MessageSquare
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: isActive ? "var(--accent)" : "var(--text-3)", flexShrink: 0 }}
                  />

                  {editingId === thread.threadId ? (
                    <div className="flex flex-1 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(thread.threadId)}
                        className="flex-1 text-xs px-2 py-1 rounded-lg outline-none"
                        style={{
                          background: "var(--sb-raised)",
                          border: "1px solid var(--sb-border-hi)",
                          color: "var(--text-1)",
                        }}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(thread.threadId)}>
                        <Check size={13} color="#4ade80" />
                      </button>
                      <button onClick={() => setEditingId(null)}>
                        <X size={13} color="var(--danger)" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="flex-1 text-xs truncate"
                        style={{ color: isActive ? "var(--text-1)" : "var(--text-2)" }}
                      >
                        {thread.title}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          className="sb-icon-btn p-1 rounded-md hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(thread.threadId);
                            setEditTitle(thread.title);
                          }}
                        >
                          <Edit2 size={12} style={{ color: "var(--text-2)" }} />
                        </button>
                        <button
                          className="sb-icon-btn p-1 rounded-md hover:bg-white/10"
                          onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }}
                        >
                          <Trash2 size={12} style={{ color: "var(--danger)" }} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

      
      
      </section>
    </>
  );
}

export default Sidebar;