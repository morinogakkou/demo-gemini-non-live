/**
 * Type definitions for the Gemini API integration
 */

export interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface GeminiApiError {
  error: {
    code: number;
    message: string;
    status: string;
    details?: Array<{
      [key: string]: any;
    }>;
  };
}

export interface RecordingStatus {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
}
