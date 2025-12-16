import React from 'react'
import "./sentiment.css"
import { useContext } from "react";
import MyContext from "./MyContext.jsx";

export default function SentimentBar() {

  const { sentiment, setSentiment,
    openSentiment, setOpenSentiment } = useContext(MyContext)
    useContext(MyContext);

  const allEmotions = sentiment.scores;
  return (
    <div className='sentimentBar'>
      <div className="message">
        <p className='main-headings'>🌟 Emotional Well-Being Analysis</p>

            Based on your recent messages, our system analyzed your emotional state across four categories.

            <p className='main-headings'>🧾 Primary Emotion</p>

            <div> <p className='prediction'>{`${sentiment.prediction} --- ${sentiment.confidence}% confidence`}</p> </div>

            <p className='main-headings'>📩 Other Detected Emotional Signals</p>


            <ul>
              {allEmotions?.map((emotion, idx) => <li key={idx}>{emotion.label} --- {emotion.score}%</li>)}
            </ul>


            <p className='main-headings'>💬 What This Means for You</p>
            {sentiment.prediction==="anxiety" ? 
            <p>You may be experiencing heightened worry or restlessness right now, which can make things feel overwhelming at times. This doesn't mean anything is wrong with you — anxiety is a common response to stress and pressure.

            Try to take things one step at a time and give yourself moments to pause and breathe. Small acts of self-care can make a meaningful difference 🌿</p> 
            : sentiment.prediction==="depression" ? 
            <p>Your messages suggest that you may be feeling emotionally low or disconnected lately. This can make even everyday tasks feel heavier than usual, and that can be really hard.

            You're not weak for feeling this way, and you don't have to go through it alone. Being gentle with yourself and reaching out for support — even in small ways — can help 💙</p> : sentiment.prediction==="happy" ? <p>You're feeling happy overall, which is a wonderful sign 🌞 
            It suggests a positive mindset and emotional balance right now.
            Keep enjoying the moments that bring you joy, and continue doing what supports your well-being. You're doing great 💙</p> : <p>You seem to be doing okay overall, which is a really good sign 🌞 Keep taking care of yourself, and continue doing what helps you stay balanced. You're on the right track 💙</p>}
      </div>
      
    </div>
  )
}
