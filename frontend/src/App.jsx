import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import MyContext from './MyContext'
import { use, useState } from 'react'
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currthreadId, setThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prevMsgs, setPrevMsgs] = useState([]);
  const [allThreads, setAllThreads] = useState([]);

  const contextValues = {
    prompt,
    setPrompt,
    reply,
    setReply, 
    currthreadId, setThreadId,
    newChat, setNewChat,
    prevMsgs, setPrevMsgs,
    allThreads, setAllThreads
  };

    return (
    <div className='app'>
    <MyContext.Provider value={contextValues}>
      <Sidebar/>
      <ChatWindow/>
    </MyContext.Provider>
    </div>
  )
}

export default App
