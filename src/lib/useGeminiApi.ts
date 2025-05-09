import { GoogleGenAI, GenerateContentResponse, type Part } from "@google/genai";

export function useGeminiApi(apiKey: string) {
  const processVoiceInput = async (
    audioBlob: Blob
  ): Promise<string | undefined> => {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    try {
      // Initialize the Gemini API with the provided key
      const genAI = new GoogleGenAI({ apiKey: apiKey });

      // Convert audio blob to base64
      const audioBase64 = await blobToBase64(audioBlob);

      // Create audio part
      const audioPart: Part = {
        inlineData: {
          data: audioBase64.split(",")[1], // Remove the data URL prefix
          mimeType: audioBlob.type,
        },
      };

      // Create the content parts
      const textPart: Part = {
        text: "You are now a cute girl.",
      };

      // Generate content with the audio input
      const result: GenerateContentResponse =
        await genAI.models.generateContent({
          contents: [{ parts: [textPart, audioPart] }],
          config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          model: "gemini-2.0-flash-001",
        });

      // Return the response text
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error(
        error instanceof Error
          ? `Gemini API error: ${error.message}`
          : "Unknown error occurred while processing audio"
      );
    }
  };

  // Helper function to convert Blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return { processVoiceInput };
}
