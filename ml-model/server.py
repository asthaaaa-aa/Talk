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
    # "suicidal": [
    #     '''
    #     Every day I feel like I am in constant pain, my mind will not shut off and its this constant discomfort of anxieties and dissatisfaction.
    #     I do not understand why were expected to stay alive. I want to end it but I am too afraid of it not working and I do not know what else. It does
    #     not help to hear from the people in my life who do not want me to do it. I wish someone could help because I do not think I can do it but it feels
    #     unbearable to keep going I want to hear from people who will not talk me out of it
    #      ''',
    #     "The struggle to go on gets harder everyday but yet I am still here waiting for something \"magical\" or whatever to make me happy or change my mindset , got a birthday coming up soon other than that I am losing the will to live.. collect money everyday until I die of old age and stress? no thanks brain keeps telling me \"why postpone it, you know you want to do it, why wait\"",
    #     "Not much to say here. I am tired of returning to this mindset in spite of everything that happens. Maybe it was just a state of mind for a while, but it feels permanent, something I cannot ever free myself from because it is just me now.I have no way of knowing if antidepressants would help. I think I am just afraid of being told it is just my state of mind and being denied the option to try. I think it might be the worry that antidepressants will not even work. Or that the people I love would feel like they were not enough if I had to rely on antidepressants.Either way, probably just going to have a cookout in my car or something, early in the morning when nobody can see. There were always easier ways but there is always a hassle and this seems the most casual of all of them. Thinking about doing it tonight"
    # ]
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
