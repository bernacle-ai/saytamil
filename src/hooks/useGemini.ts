import { GoogleGenerativeAI } from '@google/generative-ai';

export function useGemini() {
  const sendMessage = async (text: string) => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(text);
    return result.response.text();
  };

  return { sendMessage };
}