import "dotenv/config";

const getGoogleAIAPIResponse = async(messages) => {
    // Normalize messages and tolerate both `content` and legacy `parts`
    const contents = messages.map(msg => {
        const text = msg.content || "";
        return {
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text }]
        };
    });
    // contents.slice(-20) //to only get context of last 20 msgs
// ------------
//     const bodyOfGemini = {
//     contents,
//     config: {
//       systemInstruction: {
//         parts: [
//           {
//             text: `
// You are a mental health assistant. You hear the troubles people have and provide support and care to them.
//             `,
//           },
//         ],
//       },
//     },
//   };

  //------


    const options = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
            "x-goog-api-key" : `${process.env.GOOGLE_API_KEY}`
        },
        body: JSON.stringify({ 
            contents: contents,
            systemInstruction: {
                parts: [
                    {
                        text: `You are talk, a mental health assistant. You hear the troubles people have and provide support and care to them.`
                    }
                ]
            }
        })
    }

    try{
        // console.log("contents -----------" , contents)
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", options);

        const data = await response.json();
        if (!response.ok) {
            console.error("Gemini API error:", data);
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }

        const candidate = data.candidates && data.candidates[0];
        const text = candidate?.content?.parts?.[0]?.text;
        if (!text) {
            console.warn("No text in Gemini response:", data);
            return null;
        }
        // console.log("Data-------", data)
        console.log("\nText ------", text)
        return text;
    }
    catch(err) {
        console.log("getGoogleAIAPIResponse error:", err);
        return null;
    }
}

export default getGoogleAIAPIResponse;