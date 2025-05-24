import { Mic, MicOff, StopCircle } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  apiKeyExists: boolean;
}

export function VoiceRecorder({
  isRecording,
  startRecording,
  stopRecording,
  apiKeyExists,
}: VoiceRecorderProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-24 h-24 flex items-center justify-center mb-4">
        {isRecording ? (
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <Mic size={36} className="text-red-600" />
            </div>
            <div className="absolute -bottom-8 w-full flex justify-center">
              <span className="text-red-600 font-medium text-sm">
                Recording...
              </span>
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
            {apiKeyExists ? (
              <Mic size={36} className="text-slate-600" />
            ) : (
              <MicOff size={36} className="text-slate-400" />
            )}
          </div>
        )}
      </div>

      {isRecording ? (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          <StopCircle size={20} />
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          disabled={!apiKeyExists}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            apiKeyExists
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Mic size={20} />
          Start Recording
        </button>
      )}

      {!apiKeyExists && (
        <p className="mt-4 text-sm text-slate-500">
          Please enter your API key first to enable recording
        </p>
      )}
    </div>
  );
}
