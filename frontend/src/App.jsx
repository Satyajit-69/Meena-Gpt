import "./App.css";
import Sidebar from "./sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

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
      <Routes>

        {/* MAIN CHAT PAGE */}
        <Route
          path="/"
          element={
            <div className="relative w-screen h-screen bg-gray-950 overflow-hidden">
              
              {/* Sidebar */}
              <Sidebar />

              {/* Chat Window */}
              <div className="h-full w-full lg:pl-64">
                <ChatWindow />
              </div>

            </div>
          }
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

      </Routes>
    </MyContext.Provider>
  );
}

export default App;
