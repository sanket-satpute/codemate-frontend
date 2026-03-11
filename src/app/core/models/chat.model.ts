export interface ChatMessage {
  id: string;
  projectId: string;
  sender: 'USER' | 'AI';
  message: string;
  timestamp: string;
  metadata?: string;
  isStreaming?: boolean;
}

export interface ChatResponseDTO {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
}
