support_set = {
    "anxiety": [
        "Sometimes it's your own thoughts that make you anxious and afraid to close your eyes until you don't sleep",
        "Have you ever felt nervous but didn't know why?",
        "Successfully online at 9am. Even sleeping in a state of restlessness what is wrong with me"
    ],
    "depression": [
        "I just go through the motions, I find my body walking and taking me to places but I am not really there or present.Travelling, going to classesit like I am there but only 40%And when I try to remember how I got to a certain place I find myself at loss Most days I do not even feel like I am here",
        "Hi all. I want finally recover from this shit. I have it already ",
        "Feels weird saying that but I think I am there In a hotel going to get drunk and end it"
    ],
    "suicidal": [
        '''
        Every day I feel like I am in constant pain, my mind will not shut off and its this constant discomfort of anxieties and dissatisfaction.
        I do not understand why were expected to stay alive. I want to end it but I am too afraid of it not working and I do not know what else. It does
        not help to hear from the people in my life who do not want me to do it. I wish someone could help because I do not think I can do it but it feels
        unbearable to keep going I want to hear from people who will not talk me out of it
         ''',
        "The struggle to go on gets harder everyday but yet I am still here waiting for something \"magical\" or whatever to make me happy or change my mindset , got a birthday coming up soon other than that I am losing the will to live.. collect money everyday until I die of old age and stress? no thanks brain keeps telling me \"why postpone it, you know you want to do it, why wait\"",
        "Not much to say here. I am tired of returning to this mindset in spite of everything that happens. Maybe it was just a state of mind for a while, but it feels permanent, something I cannot ever free myself from because it is just me now.I have no way of knowing if antidepressants would help. I think I am just afraid of being told it is just my state of mind and being denied the option to try. I think it might be the worry that antidepressants will not even work. Or that the people I love would feel like they were not enough if I had to rely on antidepressants.Either way, probably just going to have a cookout in my car or something, early in the morning when nobody can see. There were always easier ways but there is always a hassle and this seems the most casual of all of them. Thinking about doing it tonight"
    ]
}

from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

class_prototypes = {}

for label, texts in support_set.items():
    embeddings = model.encode(texts)
    class_prototypes[label] = np.mean(embeddings, axis=0)

from sklearn.metrics.pairwise import cosine_similarity
all_scores = []
def predict_sentiment(text):
    query_embed = model.encode([text])

    best_label = None
    best_score = -1

    for label, proto_embed in class_prototypes.items():
        score = cosine_similarity(query_embed, proto_embed.reshape(1, -1))[0][0]
        all_scores.append([score, label])
        if score > best_score:
            best_score = score
            best_label = label

    return all_scores, best_label, best_score


# global all_scores
all_scores = []

text = "Just what is the point? No one cares about me or loves me. I do not deserve help. I am just done. there is no reason to go on any longer. I just want the pain to stop. I feel like I just keep going even if I cannot. But I am just done. Everyone who tries to help me either says that they cannot deal with it a couple weeks later. Or they just get angry at me and refuse to help me. what is the point to keep going. Nothing makes me happy anymore. I just sit here in my pain and cry. I am just done. I want it to stop. It hurts so much. I feel so alone. I just want to get a bunch of pills and make the pain go away. I am done"

# Renamed variables for clarity:
# 'all_scores_results' gets the list of all scores and labels.
# 'predicted_label' gets the best label (e.g., 'suicidal').
# 'confidence_score' gets the numerical confidence score (float32).
all_scores_results, predicted_label, confidence_score = predict_sentiment(text)

print("Predicted Sentiment:", predicted_label)
print("Confidence:", confidence_score)
print("All scores and labels:", all_scores_results)
# The original commented-out loop was also referencing 'score' which would be incorrect.
# for scores in all_scores:
#   print("\n", score)
