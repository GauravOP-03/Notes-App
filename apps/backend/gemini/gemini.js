require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API);
const path = require("path");
const axios = require("axios");
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

async function downloadImage(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return {
    buffer: res.data,
    mimeType: res.headers["content-type"] || "image/jpeg",
  };
}

async function summarizeImage(url) {
  const img = await downloadImage(url);
  if (!img) throw new Error("Failed to download image");

  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const base64 = Buffer.from(img.buffer).toString("base64");

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: img.mimeType,
            },
          },
          { text: "Please summarize the content of this image." },
        ],
      },
    ],
  });

  const response = result.response;
  return response.text();
}

module.exports = { summarize, tags, summarizeImage };
