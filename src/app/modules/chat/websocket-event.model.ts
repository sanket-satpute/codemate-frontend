import { ChatMessage } from './chat-message.model';

export enum WebSocketEventType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  // Add other event types as needed
}

export interface WebSocketEvent {
  eventType: WebSocketEventType;
  data: ChatMessage; // Or a more generic type if other event types have different data structures
}
