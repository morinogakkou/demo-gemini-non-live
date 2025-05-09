import { useState, useRef } from "react";
import { callGeminiAPI } from "./lib/geminiAPI";
import VoiceRecorder from "./components/VoiceRecorder";
import ApiKeyInput from "./components/ApiKeyInput";
import ResponseDisplay from "./components/ResponseDisplay";

function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setIsLoading(true);
        try {
          const geminiResponse = await callGeminiAPI(audioBlob, apiKey);
          setResponse(geminiResponse);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Unknown error occurred",
          );
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied or unavailable");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks in the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gemini Voice Assistant
        </h1>

        <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />

        <VoiceRecorder
          isRecording={isRecording}
          isLoading={isLoading}
          apiKeyValid={apiKey.length > 0}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <ResponseDisplay response={response} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
