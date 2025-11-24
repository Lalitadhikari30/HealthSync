import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Say 'Gemini is connected!'");
    console.log(result.response.text());
  } catch (err) {
    console.error("Gemini test error:", err);
  }
}

testGemini();
