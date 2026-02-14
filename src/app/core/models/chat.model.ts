export interface ChatMessage {
  id: string;
  projectId: string;
  fileId: string; // Added fileId to ChatMessage
  sender: 'user' | 'ai';
  message: string;
  timestamp: string; // Changed from Date to string (ISO 8601 format)
}

export interface SendMessageRequest {
  projectId: string;
  fileId: string; // Added fileId to SendMessageRequest
  sender: 'user' | 'ai'; // Added sender to SendMessageRequest
  message: string;
}
