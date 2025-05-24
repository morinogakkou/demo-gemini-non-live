import { useState } from "react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function ApiKeyInput({ apiKey, setApiKey }: ApiKeyInputProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div>
      <label
        htmlFor="api-key"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Gemini API Key
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showApiKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Your API key is stored locally in your browser and never sent to our
        servers.
      </p>
    </div>
  );
}
