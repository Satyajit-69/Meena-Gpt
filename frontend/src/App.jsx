import "./App.css";
import Home from "./Home.jsx";
import Sidebar from "./sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Navbar from "./Navbar.jsx";
import LandingPage from "./Landingpage.jsx";
import Footer from "./Footer.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname } = useLocation();
  const isChatPage = pathname === "/main-chat";

  // close drawer when a thread is picked / new chat is started, or route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [currThreadId, pathname]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="flex flex-col min-h-dvh w-full overflow-x-hidden bg-gray-950">
        <Navbar />

        <div className={`flex-1 min-h-0 flex flex-col ${isChatPage ? "h-[calc(100dvh-var(--navbar-h,64px))]" : ""}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* MAIN CHAT PAGE */}
            <Route
              path="/main-chat"
              element={
                <div className="relative flex flex-1 min-h-0 w-full bg-gray-950 overflow-hidden">
                  {/* Backdrop (mobile only) */}
                  {sidebarOpen && (
                    <div
                      className="fixed inset-0 z-30 bg-black/60 md:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}

                  {/* Sidebar: drawer on mobile, static on md+ */}
                  <aside
                    className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] transform transition-transform duration-300
                      md:static md:w-64 md:max-w-none md:translate-x-0 md:shrink-0
                      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                  >
                    <Sidebar />
                  </aside>

                  {/* Chat Area */}
                  <main className="relative flex-1 min-w-0 h-full overflow-hidden">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      aria-label="Open sidebar"
                      className="md:hidden absolute top-2 left-2 z-20 p-2 rounded-lg bg-gray-800 text-gray-200"
                    >
                      ☰
                    </button>
                    <ChatWindow />
                  </main>
                </div>
              }
            />

            {/* LOGIN */}
            <Route path="/login" element={<Login />} />

            {/* REGISTER */}
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        {/* footer would eat chat height, so hide it on the chat page */}
        {!isChatPage && <Footer />}
      </div>
    </MyContext.Provider>
  );
}

export default App;