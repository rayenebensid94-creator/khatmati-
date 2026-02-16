
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMotivationalMessage(progressPercent: number, daysLeft: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مرشداً روحياً، قدم رسالة تحفيزية قصيرة باللغة العربية لشخص يختم القرآن في رمضان. 
                 نسبة إنجازه الحالية هي ${progressPercent}% وتبقى له ${daysLeft} يوماً. 
                 اجعل الرسالة مشجعة وملهمة ومختصرة جداً (أقل من 20 كلمة).`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "استمر في طريق النور، فكل حرف بعشر حسنات.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ما شاء الله، تقدم مبارك! واصل وردك اليومي بهمة عالية.";
  }
}

export async function getRecalculationAdvice(remainingPages: number, remainingDays: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `المستخدم لديه ${remainingPages} صفحة متبقية و ${remainingDays} أيام. 
                 اقترح عليه نصيحة ذكية لتقسيم وقته (مثلاً القراءة بعد الفجر أو قبل النوم) بأسلوب لطيف ومحفز.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "حاول تقسيم وردك على الصلوات الخمس ليكون الإنجاز أسهل.";
  } catch (error) {
    return "تقسيم الورد على أوقات الصلاة يجعل الختمة ميسرة بإذن الله.";
  }
}
