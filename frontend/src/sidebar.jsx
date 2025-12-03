import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import { v1 as uuidv1 } from "uuid";
import {
  Plus, MessageSquare, Trash2, Edit2, Check, X,
  User, Settings, LogOut, ChevronDown
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

  const BASE_URL = "http://localhost:8000/api";

  // =============================
  // FETCH THREADS (Authenticated)
  // =============================
  const getAllThreads = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${BASE_URL}/threads`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const res = await response.json();
      if (Array.isArray(res)) {
        setAllThreads(
          res.map((t) => ({
            threadId: t.threadId,
            title: t.title,
          }))
        );
      }
    } catch (err) {
      console.log("Fetch Threads Error:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, isAuthenticated]);

  // =============================
  // CREATE NEW CHAT
  // =============================
  const createNewChat = () => {
    if (!isAuthenticated) return navigate("/login");

    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // =============================
  // LOAD THREAD
  // =============================
  const changeThread = async (newThreadId) => {
    if (!isAuthenticated) return navigate("/login");

    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`${BASE_URL}/threads/${newThreadId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("Load Thread Error:", err);
    }
  };

  // =============================
  // DELETE THREAD
  // =============================
  const deleteThread = async (threadId) => {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await fetch(`${BASE_URL}/threads/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // =============================
  // SAVE EDIT TITLE
  // =============================
  const saveEdit = (threadId) => {
    setAllThreads((prev) =>
      prev.map((t) =>
        t.threadId === threadId
          ? { ...t, title: editTitle }
          : t
      )
    );
    setEditingId(null);
  };

  // =============================
  // JSX UI
  // =============================
  return (
    <section className="flex flex-col h-screen w-64 bg-gray-900 text-white">

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} className="w-10 h-10 rounded-lg" />
          <div>
            <div className="text-lg font-bold">Meena GPT</div>
            <div className="text-xs text-gray-400">Your Smart Assistant</div>
          </div>
        </div>

        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-gray-400 px-3 py-2">Recent Chats</div>

        {!isAuthenticated ? (
          <div className="px-4 text-sm text-gray-400">Please login to see your chats.</div>
        ) : allThreads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No conversations yet</div>
        ) : (
          allThreads.map((thread) => (
            <div
              key={thread.threadId}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer ${
                thread.threadId === currThreadId
                  ? "bg-gray-800 border-l-2 border-blue-500"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => changeThread(thread.threadId)}
            >
              <MessageSquare size={16} className="text-gray-400" />

              {editingId === thread.threadId ? (
                <div className="flex-1 flex gap-1">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(thread.threadId)}>
                    <Check size={14} className="text-green-500" />
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 truncate">{thread.title}</div>
                  <div className="hidden group-hover:flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(thread.threadId);
                        setEditTitle(thread.title);
                      }}
                    >
                      <Edit2 size={14} className="text-gray-400" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                      }}
                    >
                      <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Profile Section */}
      <div className="border-t border-gray-700 p-3">
        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 text-center bg-gray-800 rounded-lg text-sm hover:bg-gray-700"
          >
            Login / Register
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>

              <div className="flex-1 text-left">
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-gray-400 truncate">{user?.email}</div>
              </div>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700">
                  <User size={16} /> My Profile
                </button>

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700">
                  <Settings size={16} /> Settings
                </button>

                <div className="border-t border-gray-700" />

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-center text-xs text-gray-500">
          Made with ❤️ by Satyajit
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
