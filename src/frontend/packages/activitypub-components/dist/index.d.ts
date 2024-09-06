import { RefObject } from 'react';
export declare namespace ACTIVITY_TYPES {
  let ACCEPT: string;
  let ADD: string;
  let ANNOUNCE: string;
  let ARRIVE: string;
  let BLOCK: string;
  let CREATE: string;
  let DELETE: string;
  let DISLIKE: string;
  let FLAG: string;
  let FOLLOW: string;
  let IGNORE: string;
  let INVITE: string;
  let JOIN: string;
  let LEAVE: string;
  let LIKE: string;
  let LISTEN: string;
  let MOVE: string;
  let OFFER: string;
  let QUESTION: string;
  let REJECT: string;
  let READ: string;
  let REMOVE: string;
  let TENTATIVE_REJECT: string;
  let TENTATIVE_ACCEPT: string;
  let TRAVEL: string;
  let UNDO: string;
  let UPDATE: string;
  let VIEW: string;
}
export declare namespace ACTOR_TYPES {
  let APPLICATION: string;
  let GROUP: string;
  let ORGANIZATION: string;
  let PERSON: string;
  let SERVICE: string;
}
export declare namespace OBJECT_TYPES {
  let ARTICLE: string;
  let AUDIO: string;
  let DOCUMENT: string;
  let EVENT: string;
  let IMAGE: string;
  let NOTE: string;
  let PAGE: string;
  let PLACE: string;
  let PROFILE: string;
  let RELATIONSHIP: string;
  let TOMBSTONE: string;
  let VIDEO: string;
}
export const PUBLIC_URI: 'https://www.w3.org/ns/activitystreams#Public';
interface UseCollectionOptions {
  dereferenceItems?: boolean;
  liveUpdates?: boolean;
}
interface AwaitActivityOptions {
  timeout?: number;
  checkExistingActivities?: boolean;
}
/**
 * NodeInfo schema version 2.1.
 */
interface NodeInfo {
  /**
   * The schema version, must be 2.1.
   */
  version: '2.1';
  /**
   * Metadata about server software in use.
   */
  software: {
    /**
     * The canonical name of this server software.
     */
    name: string;
    /**
     * The version of this server software.
     */
    version: string;
    /**
     * The url of the source code repository of this server software.
     */
    repository?: string;
    /**
     * The url of the homepage of this server software.
     */
    homepage?: string;
  };
  /**
   * The protocols supported on this server.
   */
  protocols: [
    'activitypub' | 'buddycloud' | 'dfrn' | 'diaspora' | 'libertree' | 'ostatus' | 'pumpio' | 'tent' | 'xmpp' | 'zot',
    ...(
      | 'activitypub'
      | 'buddycloud'
      | 'dfrn'
      | 'diaspora'
      | 'libertree'
      | 'ostatus'
      | 'pumpio'
      | 'tent'
      | 'xmpp'
      | 'zot'
    )[]
  ];
  /**
   * The third party sites this server can connect to via their application API.
   */
  services: {
    /**
     * The third party sites this server can retrieve messages from for combined display with regular traffic.
     */
    inbound: ('atom1.0' | 'gnusocial' | 'imap' | 'pnut' | 'pop3' | 'pumpio' | 'rss2.0' | 'twitter')[];
    /**
     * The third party sites this server can publish messages to on the behalf of a user.
     */
    outbound: (
      | 'atom1.0'
      | 'blogger'
      | 'buddycloud'
      | 'diaspora'
      | 'dreamwidth'
      | 'drupal'
      | 'facebook'
      | 'friendica'
      | 'gnusocial'
      | 'google'
      | 'insanejournal'
      | 'libertree'
      | 'linkedin'
      | 'livejournal'
      | 'mediagoblin'
      | 'myspace'
      | 'pinterest'
      | 'pnut'
      | 'posterous'
      | 'pumpio'
      | 'redmatrix'
      | 'rss2.0'
      | 'smtp'
      | 'tent'
      | 'tumblr'
      | 'twitter'
      | 'wordpress'
      | 'xmpp'
    )[];
  };
  /**
   * Whether this server allows open self-registration.
   */
  openRegistrations: boolean;
  /**
   * Usage statistics for this server.
   */
  usage: {
    /**
     * statistics about the users of this server.
     */
    users: {
      /**
       * The total amount of on this server registered users.
       */
      total?: number;
      /**
       * The amount of users that signed in at least once in the last 180 days.
       */
      activeHalfyear?: number;
      /**
       * The amount of users that signed in at least once in the last 30 days.
       */
      activeMonth?: number;
    };
    /**
     * The amount of posts that were made by users that are registered on this server.
     */
    localPosts?: number;
    /**
     * The amount of comments that were made by users that are registered on this server.
     */
    localComments?: number;
  };
  /**
   * Free form key value pairs for software specific values. Clients should not rely on any specific key present.
   */
  metadata: {
    [k: string]: unknown;
  };
}
/**
 * Subscribe a collection. Supports pagination.
 * @param predicateOrUrl The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
export const useCollection: (
  predicateOrUrl: string,
  options?: UseCollectionOptions
) => {
  items: any[];
  totalItems: number;
  error: false | unknown[];
  refetch: <TPageData>(
    options?: (import('react-query').RefetchOptions & import('react-query').RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<import('react-query').QueryObserverResult<import('react-query').InfiniteData<any>, unknown>>;
  fetchNextPage: (
    options?: import('react-query').FetchNextPageOptions | undefined
  ) => Promise<import('react-query').InfiniteQueryObserverResult<any, unknown>>;
  addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
  removeItem: (item: string | any, shouldRefetch?: boolean) => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  url: any;
  hasLiveUpdates: {
    status: string;
    error?: any;
  };
  awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
  webSocketRef: import('react').MutableRefObject<WebSocket | null>;
};
/**
 * Hook to fetch and post to the outbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `post`: a function to post a new activity in the user's outbox
 * - `awaitActivity`: a function to wait for a certain activity to be posted
 * - `owner`: the WebID of the outbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useoutbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
export const useOutbox: (options?: UseCollectionOptions) => {
  totalItems: number;
  error: false | unknown[];
  refetch: <TPageData>(
    options?: (import('react-query').RefetchOptions & import('react-query').RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<import('react-query').QueryObserverResult<import('react-query').InfiniteData<any>, unknown>>;
  fetchNextPage: (
    options?: import('react-query').FetchNextPageOptions | undefined
  ) => Promise<import('react-query').InfiniteQueryObserverResult<any, unknown>>;
  addItem: (item: any, shouldRefetch?: number | boolean) => void;
  removeItem: (item: any, shouldRefetch?: boolean) => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasLiveUpdates: {
    status: string;
    error?: any;
  };
  webSocketRef: import('react').MutableRefObject<WebSocket | null>;
  url: any;
  items: any[];
  awaitWebSocketConnection: (
    options?: import('types').AwaitActivityOptions
  ) => Promise<import('react').RefObject<WebSocket>>;
  post: (activity: object) => Promise<string | null>;
  awaitActivity: (
    matchActivity: (activity: object) => boolean,
    options?: import('types').AwaitActivityOptions
  ) => Promise<unknown>;
  owner: import('react-admin').Identifier | undefined;
};
export function CommentsField({
  source,
  context,
  helperText,
  placeholder,
  userResource,
  mentions
}: {
  source: any;
  context: any;
  helperText: any;
  placeholder: any;
  userResource: any;
  mentions: any;
}): import('react/jsx-runtime').JSX.Element;
declare namespace CommentsField {
  namespace defaultProps {
    let label: string;
    let placeholder: string;
    let source: string;
    let context: string;
  }
}
export function CollectionList({
  collectionUrl,
  resource,
  children
}: {
  collectionUrl: any;
  resource: any;
  children: any;
}): import('react/jsx-runtime').JSX.Element;
export function ReferenceCollectionField({
  source,
  reference,
  children,
  ...rest
}: {
  [x: string]: any;
  source: any;
  reference: any;
  children: any;
}): import('react/jsx-runtime').JSX.Element | null;
/**
 * Hook to fetch the inbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `awaitActivity`: a function to wait for a certain activity to be received
 * - `owner`: the WebID of the inbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useinbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
export const useInbox: (options?: UseCollectionOptions) => {
  totalItems: number;
  error: false | unknown[];
  refetch: <TPageData>(
    options?: (import('react-query').RefetchOptions & import('react-query').RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<import('react-query').QueryObserverResult<import('react-query').InfiniteData<any>, unknown>>;
  fetchNextPage: (
    options?: import('react-query').FetchNextPageOptions | undefined
  ) => Promise<import('react-query').InfiniteQueryObserverResult<any, unknown>>;
  addItem: (item: any, shouldRefetch?: number | boolean) => void;
  removeItem: (item: any, shouldRefetch?: boolean) => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasLiveUpdates: {
    status: string;
    error?: any;
  };
  webSocketRef: import('react').MutableRefObject<WebSocket | null>;
  url: any;
  items: any[];
  awaitWebSocketConnection: (
    options?: import('types').AwaitActivityOptions
  ) => Promise<import('react').RefObject<WebSocket>>;
  awaitActivity: (
    matchActivity: (activity: object) => boolean,
    options?: import('types').AwaitActivityOptions
  ) => Promise<unknown>;
  owner: import('react-admin').Identifier | undefined;
};
export const useNodeinfo: (host?: string, rel?: string) => NodeInfo | undefined;
export function useWebfinger(): {
  fetch: (id: any) => Promise<any>;
};
export function useMentions(userResource: any): {
  items:
    | (({ query }: { query: any }) => {
        id: any;
        label: any;
      }[])
    | undefined;
  render: () => {
    onStart: (props: any) => void;
    onUpdate(props: any): void;
    onKeyDown(props: any): any;
    onExit(): void;
  };
};

//# sourceMappingURL=index.d.ts.map
