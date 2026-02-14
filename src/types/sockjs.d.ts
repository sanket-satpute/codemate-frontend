declare class SockJS {
  constructor(url: string);
  // Add other methods/properties of SockJS if needed
  readyState: number;
  onopen: (() => void) | null;
  onmessage: ((ev: MessageEvent) => void) | null;
  onclose: (() => void) | null;
  send(data: string): void;
  close(): void;
}
