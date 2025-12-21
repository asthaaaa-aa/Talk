import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import MyContext from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import {
  BounceLoader,
  RingLoader,
  ScaleLoader,
  PulseLoader,
} from "react-spinners";
import SentimentBar from "./SentimentBar.jsx";

export default function ChatWindow() {
  const {
    newChat,
    setNewChat,
    prompt,
    setPrompt,
    reply,
    setReply,
    currthreadId,
    prevMsgs,
    setPrevMsgs,
    sentiment,
    setSentiment,
    openSentiment,
    setOpenSentiment,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [ sentimentLoading, setSentimentLoading] = useState(false);

  const getReply = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: prompt,
        threadId: currthreadId,
      }),
    };

    try {
      setLoading(true);

      let response = await fetch("http://localhost:3000/api/chat", options);
      let data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setNewChat(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevMsgs((prevMsgs) => [
        ...prevMsgs,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const getSentimentScore = async () => {
    try {
      setOpenSentiment(!openSentiment);
      setSentimentLoading(true);
      const scores = await fetch(
        `http://localhost:3000/api/predict/${currthreadId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await scores.json();
      // setSentiment(data)
      console.log(data);
      setSentiment(data);
      
    } catch (e) {
      console.log(e);
      // res.json(e);
    }
    setSentimentLoading(false);
  };

  return (
    <>
      <div className="chat-window">
        {/* Navbar */}
        <nav className="chat-window-navbar">
          {/* <img src="src/assets/Google_Gemini_logo.svg.png" alt="" className="logo-chatWindow"/>
           */}
          <p className="logo-main"><i class="fi fi-ts-coriander"></i> Talk.</p>
          {/* <i className="fa-solid fa-circle-user user-icon"  ></i> */}
          {/* <i className="fa-light fa-circle-user"></i> */}
          {/* <i class="fa-regular fa-circle-user user-icon"></i> */}
          {/* <i class="fi fi-rr-user"></i> */}
          <p className="ack">Made by <b> <a href="https://www.linkedin.com/in/astha-2137a4265/" target="_blank" >this human  </a> <i class="fi fi-tr-transporter"></i></b></p>
        </nav>

        {/* Chat Messages */}
        <Chat />

        {/* Input Box */}

        <PulseLoader
          className="loader"
          color="#c15f3c"
          loading={loading}
        ></PulseLoader>
        <div className={`bottom ${newChat ? "newChatBottom" : ""}`}>
          {!newChat && (
            
            <div className="sentiscore" onClick={getSentimentScore}>
              ✨Understand your chat's sentiment
            </div>
          )}

          <div className="input-box">
            <input
              type="text"
              placeholder="Start a conversation..."
              className="chat-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />
            <div className="btn-submit">
              <i
                className="send fa-solid fa-paper-plane send-icon"
                onClick={getReply}
              ></i>
            </div>
          </div>

          <p className="footer">Talk - Always there to listen.</p>
        </div>

        {/* <div className="ack"><p>Made by <b>this human</b></p></div> */}
      </div>
    </>
  );
}
