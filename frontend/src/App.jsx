import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import SentimentBar from './SentimentBar'
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
  const [openSentiment, setOpenSentiment ] = useState(false);
  const [sentiment, setSentiment] = useState({});

  const contextValues = {
    prompt,
    setPrompt,
    reply,
    setReply, 
    currthreadId, setThreadId,
    newChat, setNewChat,
    prevMsgs, setPrevMsgs,
    allThreads, setAllThreads,
    sentiment, setSentiment,
    openSentiment, setOpenSentiment
  };

    return (
    <div className='app'>
    <MyContext.Provider value={contextValues}>
      <Sidebar/>
      <ChatWindow/>
      {/* <SentimentBar/> */}
      
      {openSentiment && <SentimentBar/>}
    </MyContext.Provider>
    </div>
  )
}

export default App
