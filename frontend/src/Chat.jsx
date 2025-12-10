import "./Chat.css";
import { useContext } from "react";
import MyContext from "./MyContext.jsx";
import Markdown from 'react-markdown';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"

export default function Chat() {
  const { newChat, setNewChat, reply, prevMsgs, setPrevMsgs, prompt, setPrompt } =
    useContext(MyContext);

  return (
    <>
      

      {newChat && <h3 className="h3-main-heading">Lets talk.</h3>}

       <div className="chat-messages">
        {
          prevMsgs?.map((msg, idx) => 
            <div className={msg.role === "user" ? "userDiv" : "assistantDiv"} key={idx}>

              {msg.role === "user" ? 
              <p className="userMsg">{msg.content}</p> : 
              <Markdown rehypePlugins={[rehypeHighlight]}>{msg.content}</Markdown>}

            </div>
        )}

        {/* <div className="userDiv">
        <p className="userMsg">{prompt}</p>
      </div>
      <div className="assistantDiv">
        <p className="assistantMsg">{reply}</p>
      </div> */}
      
      </div>
    </>
  );
}
