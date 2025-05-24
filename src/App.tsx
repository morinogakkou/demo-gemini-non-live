import { useState, useRef } from "react";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { VoiceRecorder } from "./components/VoiceRecorder";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { useGeminiApi } from "./lib/useGeminiApi";

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { processVoiceInput } = useGeminiApi(apiKey);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      setIsLoading(false);
      setResponse(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        handleVoiceSubmission(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        "Microphone access denied. Please allow microphone access to use this feature."
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSubmission = async (audioBlob: Blob) => {
    if (!apiKey) {
      setError("Please enter a Gemini API key first");
      return;
    }

    try {
      setIsLoading(true);
      const result = await processVoiceInput(audioBlob);
      setResponse(result ?? null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your request"
      );
      console.error("Error processing voice input:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Gemini Multimodal Voice Demo
          </h1>
          <p className="text-slate-600 mt-2">
            Speak to Gemini AI and get responses in real-time
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center">
          <VoiceRecorder
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            apiKeyExists={!!apiKey}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            <p>{error}</p>
          </div>
        )}

        <ResponseDisplay response={response} isLoading={isLoading} />
      </div>
    </div>
  );
}
