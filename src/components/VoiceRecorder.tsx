import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
  isLoading: boolean;
  apiKeyValid: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const VoiceRecorder = ({
  isRecording,
  isLoading,
  apiKeyValid,
  startRecording,
  stopRecording,
}: VoiceRecorderProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="w-24 h-24 flex items-center justify-center">
        {isLoading ? (
          <div className="animate-pulse">
            <Loader2 size={64} className="text-blue-500 animate-spin" />
          </div>
        ) : (
          <button
            disabled={!apiKeyValid || isLoading}
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : apiKeyValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isRecording ? (
              <MicOff size={36} className="text-white" />
            ) : (
              <Mic size={36} className="text-white" />
            )}
          </button>
        )}
      </div>
      <p className="mt-4 text-center">
        {!apiKeyValid
          ? "Enter your API key to start"
          : isLoading
            ? "Processing your audio..."
            : isRecording
              ? "Recording... Click to stop"
              : "Click microphone to start recording"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
