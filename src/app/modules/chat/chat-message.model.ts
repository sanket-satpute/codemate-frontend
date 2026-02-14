export interface ChatMessage {
  messageId: string;
  projectId: string;
  sender: 'USER' | 'AI';
  content: string;
  timestamp: string;
}
