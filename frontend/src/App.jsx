import './App.css';
import Sidebar from "./sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="w-screen h-screen flex bg-gray-950 overflow-hidden">

        {/* Sidebar */}
        <div className="w-[280px] h-full bg-gray-900 border-r border-gray-800">
          <Sidebar />
        </div>

        {/* Chat Window */}
        <div className="flex-1 h-full overflow-hidden">
          <ChatWindow />
        </div>

      </div>
    </MyContext.Provider>
  );
}

export default App;
