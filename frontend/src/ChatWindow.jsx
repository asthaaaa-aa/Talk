import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import MyContext from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import {BounceLoader, RingLoader, ScaleLoader} from "react-spinners"


export default function ChatWindow() {
    const { newChat, setNewChat, prompt, setPrompt, reply, setReply, currthreadId, prevMsgs, setPrevMsgs } = useContext(MyContext);
    const [loading, setLoading] = useState(false)

    const getReply = async () => {
        const options = {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            }, 

            body : JSON.stringify({
                message : prompt,
                threadId : currthreadId
            })
        }

        try {
            setLoading(true);
            

            let response = await fetch("http://localhost:3000/api/chat", options);
            let data = await response.json();
            setReply(data.reply);
            
        } catch (err) {
            res.status(500).json({error : err.message});
            // console.log(err)
        }
        setLoading(false);
        setNewChat(false)

    }

    useEffect(() => {
        if(prompt && reply){
            setPrevMsgs( prevMsgs => (
                [...prevMsgs, {
                    role : "user",
                    content : prompt
                }, {
                    role : "assistant",
                    content : reply
                }]
            ))
        }
        setPrompt("");
        

    }, [reply])


  return (
    <div className="chat-window">
        {/* Navbar */}
        <nav className="chat-window-navbar">
            {/* <img src="src/assets/Google_Gemini_logo.svg.png" alt="" className="logo-chatWindow"/>
             */}
             <p className="logo-main">Talk.</p>
            {/* <i className="fa-solid fa-circle-user user-icon"  ></i> */}
            {/* <i className="fa-light fa-circle-user"></i> */}
            <i class="fa-regular fa-circle-user user-icon"></i>
        </nav>

    
        {/* Chat Messages */}
        <Chat/>

        {/* Input Box */}
        
        <RingLoader className="loader" color="#fff" loading={loading}></RingLoader>
        
        <div className="bottom">
        <div className="input-box">
            <input type="text" placeholder="Start a conversation..." className="chat-input"  value={prompt}  onChange={ (e) => setPrompt(e.target.value) } onKeyDown={(e) => e.key==="Enter"?getReply() : ""} />
            <div className="btn-submit"><i className="send fa-solid fa-paper-plane send-icon" onClick={getReply}></i></div>
        </div>

        <p className="footer">Talk - Always there to listen.</p>
        </div>
        

        
    </div>
  )
}
