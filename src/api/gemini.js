import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV_CONFIG } from "../utils/config";

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
  
  const callGeminiAPI = async (prompt, imageFile = null) => {
    const apiKey = GEMINI.GEMINI_KEY;
    if (!apiKey) throw new Error("API Key가 없습니다. .env 파일을 확인해주세요.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // 멀티모달(이미지 인식)을 위해 최신 모델 사용
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