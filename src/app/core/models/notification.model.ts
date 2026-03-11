export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date | string;
  read: boolean;
}
