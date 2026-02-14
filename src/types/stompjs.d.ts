declare module '@stomp/stompjs' {
    export interface IFrame {
        headers: Record<string, string>;
        body: string;
    }

    export interface IMessage extends IFrame {
        ack(): void;
        nack(): void;
    }

    export type StompHeaders = Record<string, string>;

    export interface StompClient {
        connected: boolean;
        debug: (...args: any[]) => void;
        over(ws: any): StompClient;
        connect(headers: StompHeaders, connectCallback: (frame?: IFrame) => any, errorCallback?: (error: string | IFrame) => any): void;
        disconnect(disconnectCallback?: () => any, headers?: StompHeaders): void;
        send(destination: string, headers?: StompHeaders, body?: string): void;
        subscribe(destination: string, callback: (message: IMessage) => any, headers?: StompHeaders): StompSubscription;
        unsubscribe(id: string): void;
    }

    export interface StompSubscription {
        id: string;
        unsubscribe(): void;
    }

    export const Stomp: StompClient;
}

// Global declaration for the external Stomp library if not using modules
declare const Stomp: {
  over(ws: any): StompClient;
};

interface StompClient {
  connect(headers: object, connectCallback: () => void, errorCallback: (error: unknown) => void): void;
  subscribe(destination: string, callback: (message: { body: string }) => void): void;
  send(destination: string, headers: object, body: string): void;
  disconnect(callback: () => void): void;
}
