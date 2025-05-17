require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API);

async function summarize(noteContent) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `uou are notenest ai you have to summarize this content : ${noteContent}`;
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
  const prompt = `Choose up to 3 relevant tags from this list: lecture, assignment, exam, code, project, todo, research, idea, personal. Apply them to the following note content, (just give me 3 tags in 3 words nothing else): ${noteContent}`;
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
  return response;
}
module.exports = { summarize, tags };
