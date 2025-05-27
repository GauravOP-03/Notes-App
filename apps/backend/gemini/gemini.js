require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API);

async function summarize(noteContent) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `you are notenest ai, an AI powered notes application, you have to summarize this content : ${noteContent}`;
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  const response = await result.response;
  //   console.log(response.text());
  return response.text();
}

async function tags(noteContent) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Analyze this note and return exactly 3 single words separated by commas (format: word1, word2, word3): ${noteContent}`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  const response = result.response;
  //   console.log(response.text());
  return response.text();
}
module.exports = { summarize, tags };
