declare module 'nextgraph' {
  export function init_headless(config: any): Promise<void>;
  export function session_headless_start(userId: string): Promise<{ session_id: string }>;
  export function session_headless_stop(sessionId: string, force: boolean): Promise<void>;
  export function sparql_query(sessionId: string, query: string): Promise<any>;
  export function sparql_update(sessionId: string, query: string): Promise<void>;
  export function admin_create_user(config: any): Promise<string>;
} 