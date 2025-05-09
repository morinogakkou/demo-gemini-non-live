import { useState } from "react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput = ({ apiKey, setApiKey }: ApiKeyInputProps) => {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="mb-6">
      <label
        htmlFor="api-key"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Gemini API Key
      </label>
      <div className="relative">
        <input
          type={showApiKey ? "text" : "password"}
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowApiKey(!showApiKey)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          {showApiKey ? "Hide" : "Show"}
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        You can get an API key from the Google AI Studio
      </p>
    </div>
  );
};

export default ApiKeyInput;
