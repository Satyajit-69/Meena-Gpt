import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "../context/useAuth.js";
import { v1 as uuidv1 } from "uuid";
import {
  Plus, MessageSquare, Trash2, Edit2, Check, X,
  User, Settings, LogOut, ChevronDown, Menu, XCircle
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const BASE_URL = "https://meena-gpt-1.onrender.com/api";

  // Fetch threads
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

  // Create new chat
  const createNewChat = () => {
    if (!isAuthenticated) return navigate("/login");

    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Load thread
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
      setIsSidebarOpen(false); // Close sidebar on mobile
    } catch (err) {
      console.log("Load Thread Error:", err);
    }
  };

  // Delete thread
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

  // Save edit
  const saveEdit = (threadId) => {
    setAllThreads((prev) =>
      prev.map((t) =>
        t.threadId === threadId ? { ...t, title: editTitle } : t
      )
    );
    setEditingId(null);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.menu-button')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="menu-button fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2.5 rounded-lg shadow-lg hover:bg-gray-700 transition-colors active:scale-95"
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <XCircle size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Wrapper - only animates on mobile */}
      <div className={`fixed lg:static inset-0 z-40 lg:z-auto ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none lg:pointer-events-auto'}`}>
        {/* Overlay for mobile */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <section
          className={`sidebar-container fixed lg:static inset-y-0 left-0 flex flex-col h-screen w-72 sm:w-80 lg:w-64 bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} className="w-10 h-10 rounded-lg shadow-md" alt="Meena GPT Logo" />
            <div>
              <div className="text-lg font-bold">Meena GPT</div>
              <div className="text-xs text-gray-400">Your Smart Assistant</div>
            </div>
          </div>

          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                       rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="text-xs text-gray-400 px-3 py-2 font-medium">Recent Chats</div>

          {!isAuthenticated ? (
            <div className="px-4 py-6 text-center">
              <div className="text-sm text-gray-400 mb-3">Please login to see your chats</div>
              <button
                onClick={() => {
                  navigate("/login");
                  setIsSidebarOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors active:scale-95"
              >
                Login Now
              </button>
            </div>
          ) : allThreads.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare size={32} className="mx-auto mb-3 text-gray-600" />
              <div className="text-sm text-gray-500">No conversations yet</div>
              <div className="text-xs text-gray-600 mt-1">Start a new chat to begin</div>
            </div>
          ) : (
            <div className="space-y-1">
              {allThreads.map((thread) => (
                <div
                  key={thread.threadId}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    thread.threadId === currThreadId
                      ? "bg-gray-800 border-l-4 border-blue-500 shadow-md"
                      : "hover:bg-gray-800/70 active:bg-gray-800"
                  }`}
                  onClick={() => changeThread(thread.threadId)}
                >
                  <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />

                  {editingId === thread.threadId ? (
                    <div className="flex-1 flex gap-1">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(thread.threadId);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(thread.threadId);
                        }}
                        className="p-1 hover:bg-gray-600 rounded active:scale-95"
                      >
                        <Check size={14} className="text-green-500" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 hover:bg-gray-600 rounded active:scale-95"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 truncate text-sm">{thread.title}</div>
                      <div className="hidden group-hover:flex gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(thread.threadId);
                            setEditTitle(thread.title);
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-colors active:scale-95"
                        >
                          <Edit2 size={14} className="text-gray-400 hover:text-white" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.threadId);
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-colors active:scale-95"
                        >
                          <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-700 p-3">
          {!isAuthenticated ? (
            <button
              onClick={() => {
                navigate("/login");
                setIsSidebarOpen(false);
              }}
              className="w-full py-2.5 text-center bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium active:scale-95"
            >
              Login / Register
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-800 rounded-lg transition-colors active:bg-gray-800"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User size={18} className="text-white" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform flex-shrink-0 ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-slideUp">
                  <button 
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 flex items-center gap-3 transition-colors active:bg-gray-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} /> 
                    <span>My Profile</span>
                  </button>

                  <button 
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 flex items-center gap-3 transition-colors active:bg-gray-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} /> 
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-gray-700 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      setShowProfileMenu(false);
                      setIsSidebarOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-3 transition-colors active:bg-gray-600"
                  >
                    <LogOut size={16} /> 
                    <span>Sign Out</span>
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
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.5);
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Sidebar;