import {
  GoogleGenAI,
  GenerateContentResponse,
  type Part,
  Type,
} from "@google/genai";

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

      // Create the content parts(if needed)
      /*
      const textPart: Part = {
        text: "",
      };*/

      // Generate content with the audio input
      const result: GenerateContentResponse =
        await genAI.models.generateContent({
          contents: [{ parts: [audioPart] }],
          config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                transcriptOfInput: {
                  type: Type.STRING,
                },
                response: {
                  type: Type.STRING,
                },
              },
              propertyOrdering: ["transcriptOfInput", "response"],
            },
          },
          model: "gemini-2.0-flash-001",
        });

      // Return the response text
      const usageMetadata = result.usageMetadata;
      const text = result.text;
      let jsonResponse: { transcriptOfInput: string; response: string };
      let transcriptOfInput: string | undefined;
      let response: string | undefined;
      if (typeof text === "string") {
        jsonResponse = JSON.parse(text);
        transcriptOfInput = jsonResponse.transcriptOfInput;
        response = jsonResponse.response;
      }
      return (
        "\ntranscriptOfInput: " +
        transcriptOfInput +
        "\nresponse: " +
        response +
        "\ntotalTokenCount: " +
        usageMetadata?.totalTokenCount +
        "\npromptTokensDetails: " +
        usageMetadata?.promptTokensDetails
          ?.map((detail) => `{${detail.modality}: ${detail.tokenCount}}`)
          .join(", ") +
        "\ncandidatesTokensDetails: " +
        usageMetadata?.candidatesTokensDetails
          ?.map((detail) => `{${detail.modality}: ${detail.tokenCount}}`)
          .join(", ") +
        "\n--------------------" +
        "\nreturnedText: " +
        text +
        "\nusageMetaData: " +
        JSON.stringify(usageMetadata)
      );
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
