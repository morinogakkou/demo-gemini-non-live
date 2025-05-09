interface ResponseDisplayProps {
  response: string | null;
  isLoading: boolean;
}

export function ResponseDisplay({ response, isLoading }: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Processing your voice input...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <p className="text-slate-500 italic">
            Voice responses will appear here after recording
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">
        Gemini's Response
      </h2>
      <div className="prose prose-slate max-w-none">
        {response.split("\n").map((paragraph, index) => (
          <p key={index} className={paragraph.trim() === "" ? "h-4" : "mb-4"}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
