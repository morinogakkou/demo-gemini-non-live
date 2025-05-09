/**
 * Helper functions for interacting with the Gemini API
 */

/**
 * Call Gemini API with audio input and return the text response
 */
export async function callGeminiAPI(
  audioBlob: Blob,
  apiKey: string,
): Promise<string> {
  try {
    // Convert audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    // Prepare the request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "audio/webm",
                    data: base64Audio.split("base64,")[1],
                  },
                },
              ],
            },
          ],
          generation_config: {
            temperature: 0.4,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message ||
          `API request failed with status ${response.status}`,
      );
    }

    const data = await response.json();

    // Extract text response from Gemini API
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No valid response received from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Convert a Blob to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
