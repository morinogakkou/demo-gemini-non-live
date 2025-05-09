interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
}

const ResponseDisplay = ({ response, isLoading }: ResponseDisplayProps) => {
  if (!response && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Gemini Response:</h2>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-32">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{response}</div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;
