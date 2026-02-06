import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV_CONFIG } from "../utils/config";

// 파일 객체를 Gemini 포맷으로 변환 (내부에서만 쓰이므로 export 안 함)
const fileToGenerativePart = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: reader.result.split(",")[1],
          mimeType: file.type,
        },
      });
    };
    reader.readAsDataURL(file);
  });
};

// [중요] 외부에서 사용할 수 있도록 export 키워드 추가
export const callGeminiAPI = async (prompt, imageFile = null) => {
  const apiKey = ENV_CONFIG.GEMINI_KEY;
  if (!apiKey) throw new Error("API Key가 없습니다. .env 파일을 확인해주세요.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    let result;
    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};