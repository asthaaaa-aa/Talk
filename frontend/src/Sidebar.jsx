import { useContext, useEffect } from "react"
import "./Sidebar.css"
import MyContext from "./MyContext"
import {v1 as uuidv1} from "uuid";

export default function Sidebar() {

  const {prompt,
    setPrompt,
    reply,
    setReply, 
    currthreadId, setThreadId,
    newChat, setNewChat,
    prevMsgs, setPrevMsgs,
    allThreads, setAllThreads} = useContext(MyContext);

  const getAllThreads = async() => {
    try{

      const response = await fetch("http://localhost:3000/api/threads");
      const data = await response.json();
      const filteredData = data.map( thread => ({threadId: thread.threadId , title : thread.title}))
      setAllThreads(filteredData)

    } catch(err){
      console.log(err);
    }
  }

  useEffect( () => {
    getAllThreads();
  }, [currthreadId]);


  const createNewChat = () => {
    setThreadId(uuidv1());
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setPrevMsgs([]);
    
  }



  const changeThread = async(newthreadId) => {
    setThreadId(newthreadId);

    try {
      const response = await fetch(`http://localhost:3000/api/threads/${newthreadId}`);
      const data = await response.json();
      setPrevMsgs(data);
      setNewChat(false)
      console.log(data)
      setReply(null);
      
    } catch (err) {
      console.log(err)
    }

  }
  return (
    <section className="sidebar">
        {/* <img src="src/assets/sidebarLogo.webp" alt="" className="logo"/> */}
        <button onClick={createNewChat}>
            {/* <i class="fa-solid fa-wand-sparkles"></i> */}
            <i className="fa-solid fa-plus plus-icon"></i>
            New Chat
        </button>
        

        <ul className="threadHistory">
          {allThreads?.map((thread,idx) => <li key={idx} onClick={()=>changeThread(thread.threadId)}>{`${thread.title}`}</li>)}
        </ul>
    </section>
  )
}

