from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Support Set
support_set = {
    "doing okay": [
        "I feel calm and steady these days, handling my routine without stress, enjoying small moments, and feeling generally content with how life is moving forward right now.",
        "Nothing feels overwhelming at the moment, and I'm able to focus on my work, rest well, and maintain a balanced mindset throughout most of my days.",
        "I'm not extremely excited or sad, just peacefully okay, managing responsibilities, staying relaxed, and feeling satisfied with the simple rhythm of everyday life."
    ],

    "happy": [
        "I feel genuinely happy today, full of positive energy, smiling without any reason, and enjoying everything around me more than usual, from conversations to the smallest moments.",
        "There's a deep sense of joy inside me right now, making everything feel lighter, brighter, and more meaningful, and I can't help but feel grateful and excited.",
        "I'm in such a great mood that even ordinary things feel special, and I feel motivated, cheerful, and completely present in this happy moment."
    ],

    "anxiety": [
        "Sometimes it's your own thoughts that make you anxious and afraid to close your eyes until you don't sleep",
        "Have you ever felt nervous but didn't know why?",
        "Successfully online at 9am. Even sleeping in a state of restlessness what is wrong with me"
    ],

    "depression": [
        "I just go through the motions, I find my body walking and taking me to places but I am not really there or present.Travelling, going to classesit like I am there but only 40%And when I try to remember how I got to a certain place I find myself at loss Most days I do not even feel like I am here",
        "Hi all. I want finally recover from this shit. I have it already ",
        "Feels weird saying that but I think I am there In a hotel going to get drunk and end it"
    ]
}

# Load SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")

# Build prototypes
class_prototypes = {}
for label, texts in support_set.items():
    embeddings = model.encode(texts)
    class_prototypes[label] = np.mean(embeddings, axis=0)

class InputText(BaseModel):
    text: str

@app.post("/predict/")
def predict_sentiment(data: InputText):
    text = data.text
    query_embed = model.encode([text])

    best_label = None
    best_score = -1
    scores_list = []

    for label, proto_embed in class_prototypes.items():
        score = cosine_similarity(query_embed, proto_embed.reshape(1, -1))[0][0]
        scores_list.append({"label": label, "score": round(float(score)*100, 2)})
        if score > best_score:
            best_score = score
            best_label = label
    
    
    return {
        "prediction": best_label,
        "confidence": round(float(best_score) * 100, 2),
        "scores": scores_list
    }
