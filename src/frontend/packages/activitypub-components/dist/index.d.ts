import { RefObject, MutableRefObject } from 'react';
import { Identifier } from 'react-admin';
import { JSX } from 'react/jsx-runtime';
import { LdoBase, ShapeType } from '@ldo/ldo';
export const ACTIVITY_TYPES: {
  ACCEPT: string;
  ADD: string;
  ANNOUNCE: string;
  ARRIVE: string;
  BLOCK: string;
  CREATE: string;
  DELETE: string;
  DISLIKE: string;
  FLAG: string;
  FOLLOW: string;
  IGNORE: string;
  INVITE: string;
  JOIN: string;
  LEAVE: string;
  LIKE: string;
  LISTEN: string;
  MOVE: string;
  OFFER: string;
  QUESTION: string;
  REJECT: string;
  READ: string;
  REMOVE: string;
  TENTATIVE_REJECT: string;
  TENTATIVE_ACCEPT: string;
  TRAVEL: string;
  UNDO: string;
  UPDATE: string;
  VIEW: string;
};
export const ACTOR_TYPES: {
  APPLICATION: string;
  GROUP: string;
  ORGANIZATION: string;
  PERSON: string;
  SERVICE: string;
};
export const OBJECT_TYPES: {
  ARTICLE: string;
  AUDIO: string;
  DOCUMENT: string;
  EVENT: string;
  IMAGE: string;
  NOTE: string;
  PAGE: string;
  PLACE: string;
  PROFILE: string;
  RELATIONSHIP: string;
  TOMBSTONE: string;
  VIDEO: string;
};
export const PUBLIC_URI = 'https://www.w3.org/ns/activitystreams#Public';
interface UseCollectionOptions {
  dereferenceItems?: boolean;
  liveUpdates?: boolean;
  shaclShapeUri?: string;
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
 * Subscribe toa collection. Supports pagination.
 * @param predicateOrUrl The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
export const useCollection: (
  predicateOrUrl: string,
  options?: UseCollectionOptions
) =>
  | {
      items: any[];
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      url: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      webSocketRef: MutableRefObject<WebSocket | null>;
    }
  | {
      totalItems: number;
      items: any[];
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      url: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      webSocketRef: MutableRefObject<WebSocket | null>;
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
export const useOutbox: (options?: UseCollectionOptions) =>
  | {
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: any, shouldRefetch?: number | boolean) => void;
      removeItem: (item: any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      webSocketRef: MutableRefObject<WebSocket | null>;
      url: any;
      items: any[];
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      post: (activity: object) => Promise<string | null>;
      awaitActivity: (matchActivity: (activity: object) => boolean, options?: AwaitActivityOptions) => Promise<unknown>;
      owner: Identifier | undefined;
    }
  | {
      totalItems: number;
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: any, shouldRefetch?: number | boolean) => void;
      removeItem: (item: any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      webSocketRef: MutableRefObject<WebSocket | null>;
      url: any;
      items: any[];
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      post: (activity: object) => Promise<string | null>;
      awaitActivity: (matchActivity: (activity: object) => boolean, options?: AwaitActivityOptions) => Promise<unknown>;
      owner: Identifier | undefined;
    };
export const CommentsField: ({ source, context, helperText, placeholder, userResource, mentions }: any) => JSX.Element;
export const CollectionList: ({ collectionUrl, resource, children }: any) => JSX.Element;
export const ReferenceCollectionField: ({ source, reference, children, ...rest }: any) => JSX.Element | null;
interface UseTypedCollectionOptions<ItemType extends LdoBase> {
  shapeTypes: ShapeType<ItemType>[];
  pageSize: number;
}
/**
 * Subscribe to a collection. Supports pagination.
 * @param collectionUri The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions & UseTypedCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false, pageSize: 10 }` and requires at least one ldo @see {ShapeType}.
 */
export const useTypedCollection: <ItemType extends LdoBase>(
  collectionUri: string,
  options: UseCollectionOptions & UseTypedCollectionOptions<ItemType>
) => any;
/**
 * Hook to fetch the inbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `awaitActivity`: a function to wait for a certain activity to be received
 * - `owner`: the WebID of the inbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useinbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
export const useInbox: (options?: UseCollectionOptions) =>
  | {
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: any, shouldRefetch?: number | boolean) => void;
      removeItem: (item: any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      webSocketRef: MutableRefObject<WebSocket | null>;
      url: any;
      items: any[];
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      awaitActivity: (matchActivity: (activity: object) => boolean, options?: AwaitActivityOptions) => Promise<unknown>;
      owner: Identifier | undefined;
    }
  | {
      totalItems: number;
      error: false | any[];
      refetch: any;
      fetchNextPage: any;
      addItem: (item: any, shouldRefetch?: number | boolean) => void;
      removeItem: (item: any, shouldRefetch?: boolean) => void;
      hasNextPage: any;
      isLoading: any;
      isFetching: any;
      isFetchingNextPage: any;
      hasLiveUpdates: {
        status: string;
        error?: any;
      };
      webSocketRef: MutableRefObject<WebSocket | null>;
      url: any;
      items: any[];
      awaitWebSocketConnection: (options?: AwaitActivityOptions) => Promise<RefObject<WebSocket>>;
      awaitActivity: (matchActivity: (activity: object) => boolean, options?: AwaitActivityOptions) => Promise<unknown>;
      owner: Identifier | undefined;
    };
export const useNodeinfo: (host?: string, rel?: string) => NodeInfo | undefined;
export const useWebfinger: () => {
  fetch: (id: any) => Promise<any>;
};
export const useMentions: (userResource: any) => {
  items:
    | (({ query }: any) => {
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
