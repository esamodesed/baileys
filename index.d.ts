export * from 'baileys';

export class TelegramBot {
  constructor(token: string);
  on(event: string, handler: Function): void;
  send(chatId: string | number, text: string, options?: any): Promise<any>;
  start(): Promise<void>;
  stop(): void;
}

export interface APIInstance {
  get(path: string, handler: Function): APIInstance;
  post(path: string, handler: Function): APIInstance;
  start(): void;
  stop(): void;
}

export function createAPI(options?: { port?: number; sock?: any }): APIInstance;
export function attachHelpers(sock: any): any;
export const rey2ndVersion: string;
