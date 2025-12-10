import "dotenv/config";

const getGoogleAIAPIResponse = async(message) => {
    const options = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
            "x-goog-api-key" : `${process.env.GOOGLE_API_KEY}`
        },

        body: JSON.stringify({
            contents: [
            {
                role: "user",
                parts: [
                { text: message }
                ]
            }]
        })
    }
    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", options);
        const data = await response.json();
        return (data.candidates[0].content.parts[0].text);
    }
    catch(err) {
        console.log(err);
    }
}

export default getGoogleAIAPIResponse;