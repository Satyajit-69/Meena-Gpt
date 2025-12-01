import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { Plus, MessageSquare, Trash2, Edit2, Check, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import logo from "./assets/ChatBot.png";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const BASE_URL = "http://localhost:8000/api";

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${BASE_URL}/threads`);
            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${BASE_URL}/threads/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        if (!window.confirm('Are you sure you want to delete this conversation?')) return;

        try {
            const response = await fetch(`${BASE_URL}/threads/${threadId}`, { method: "DELETE" });
            await response.json();

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const startEdit = (threadId, title) => {
        setEditingId(threadId);
        setEditTitle(title);
    };

    const saveEdit = async (threadId) => {
        try {
            // TODO: Update on backend once edit endpoint exists
            setAllThreads(prev =>
                prev.map(thread =>
                    thread.threadId === threadId
                        ? { ...thread, title: editTitle }
                        : thread
                )
            );
            setEditingId(null);
        } catch (err) {
            console.log(err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    return (
        <section className="flex flex-col h-screen w-64 bg-gray-900 text-white">
            {/* Logo Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <img src={logo} alt="SigmaGPT Logo" className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                        <div className="text-lg font-bold">Meena GPT</div>
                        <div className="text-xs text-gray-400">Your Smart Assistant</div>
                    </div>
                </div>

                <button
                    onClick={createNewChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
                >
                    <Plus size={20} />
                    <span className="font-medium">New Chat</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <div className="text-xs text-gray-400 px-3 py-2 font-semibold">Recent Chats</div>

                {allThreads?.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <MessageSquare size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500">No conversations yet</p>
                        <p className="text-xs text-gray-600 mt-1">Start a new chat to begin</p>
                    </div>
                ) : (
                    allThreads?.map((thread, idx) => (
                        <div
                            key={idx}
                            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors ${
                                thread.threadId === currThreadId
                                    ? 'bg-gray-800 border-l-2 border-blue-500'
                                    : 'hover:bg-gray-800'
                            }`}
                            onClick={() => !editingId && changeThread(thread.threadId)}
                        >
                            <MessageSquare size={16} className="flex-shrink-0 text-gray-400" />

                            {editingId === thread.threadId ? (
                                <div className="flex-1 flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm outline-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEdit(thread.threadId);
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                    />
                                    <button onClick={() => saveEdit(thread.threadId)} className="p-1 hover:bg-gray-600 rounded">
                                        <Check size={14} className="text-green-500" />
                                    </button>
                                    <button onClick={cancelEdit} className="p-1 hover:bg-gray-600 rounded">
                                        <X size={14} className="text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm truncate">{thread.title}</div>
                                    </div>

                                    <div className="hidden group-hover:flex items-center gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(thread.threadId, thread.title);
                                            }}
                                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                                            title="Edit title"
                                        >
                                            <Edit2 size={14} className="text-gray-400" />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteThread(thread.threadId);
                                            }}
                                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                                            title="Delete"
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
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium truncate">User</div>
                            <div className="text-xs text-gray-400 truncate">user@example.com</div>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                            <button className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3">
                                <User size={16} /> My Profile
                            </button>

                            <button className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3">
                                <Settings size={16} /> Settings
                            </button>

                            <div className="border-t border-gray-700 my-1"></div>

                            <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-3">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                        Made with <span className="text-red-500">♥</span> by Satyajit 
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Sidebar;
