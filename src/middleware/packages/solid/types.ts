import { WebSocketServer, WebSocket, ErrorEvent, Data } from 'ws';
import { IncomingRequest } from 'moleculer-web';
import { ServerResponse } from 'http';

export interface TypeRegistration {
  types: string[];
  uri: string;
  isPrivate: boolean;
  isContainer: boolean;
}

export interface NotificationChannel {
  id: string;
  topic: string;
  sendTo: string;
  receiveFrom: string;
  webId: string;
}

export interface WebSocketConnection {
  server: WebSocketServer;
  request: IncomingRequest;
  response: ServerResponse;
  requestUrl: string;
  baseUrl: string;
  parsedUrl: string;
  params: Record<string, unknown>;
  webSocket: WebSocket;
  send: WebSocket['send'];
}

export interface WebSocketHandlers {
  onConnection: (connection: Connection) => void;
  onClose: (event: CloseEvent, connection: Connection) => void;
  onMessage: (message: Data, connection: Connection) => void;
  onError: (event: ErrorEvent, connection: Connection) => void;
}
