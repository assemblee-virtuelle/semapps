import { RefObject, MutableRefObject } from 'react';
import {
  RefetchOptions,
  InfiniteData,
  QueryObserverResult,
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  FetchPreviousPageOptions,
  FetchStatus
} from '@tanstack/react-query';
import {
  RefetchOptions as _RefetchOptions1,
  InfiniteData as _InfiniteData1,
  QueryObserverResult as _QueryObserverResult1,
  FetchNextPageOptions as _FetchNextPageOptions1,
  InfiniteQueryObserverResult as _InfiniteQueryObserverResult1
} from '@tanstack/query-core';
import { Identifier } from 'react-admin';
import { JSX } from 'react/jsx-runtime';
import { LdoBase, ShapeType } from '@ldo/ldo';
import { SolidConnectedPlugin } from '@ldo/connected-solid';
import { ConnectedLdoDataset } from '@ldo/connected';
import { OrderedCollectionPage } from '@activitypods/ldo-shapes';
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
      error: false | (Error | null)[];
      refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfiniteData<any, unknown>, Error>>;
      fetchNextPage: (
        options?: FetchNextPageOptions
      ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
      error: false | (Error | null)[];
      refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfiniteData<any, unknown>, Error>>;
      fetchNextPage: (
        options?: FetchNextPageOptions
      ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
      error: false | (Error | null)[];
      refetch: (options?: _RefetchOptions1) => Promise<_QueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      fetchNextPage: (
        options?: _FetchNextPageOptions1
      ) => Promise<_InfiniteQueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
      error: false | (Error | null)[];
      refetch: (options?: _RefetchOptions1) => Promise<_QueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      fetchNextPage: (
        options?: _FetchNextPageOptions1
      ) => Promise<_InfiniteQueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
) =>
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: InfiniteData<
        | {
            itemIds: never[];
            dataset: null;
            data: null;
            pageUri?: undefined;
          }
        | {
            itemIds: string[];
            dataset: null;
            pageUri: string;
            data: null;
          }
        | {
            dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
            itemIds: string[];
            pageUri: string;
            data: OrderedCollectionPage;
          },
        unknown
      >;
      error: Error;
      isError: true;
      isPending: false;
      isLoading: false;
      isLoadingError: false;
      isRefetchError: true;
      isSuccess: false;
      isPlaceholderData: false;
      status: 'error';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchNextPageError: boolean;
      isFetchingNextPage: boolean;
      isFetchPreviousPageError: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    }
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: InfiniteData<
        | {
            itemIds: never[];
            dataset: null;
            data: null;
            pageUri?: undefined;
          }
        | {
            itemIds: string[];
            dataset: null;
            pageUri: string;
            data: null;
          }
        | {
            dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
            itemIds: string[];
            pageUri: string;
            data: OrderedCollectionPage;
          },
        unknown
      >;
      error: null;
      isError: false;
      isPending: false;
      isLoading: false;
      isLoadingError: false;
      isRefetchError: false;
      isFetchNextPageError: false;
      isFetchPreviousPageError: false;
      isSuccess: true;
      isPlaceholderData: false;
      status: 'success';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    }
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: undefined;
      error: Error;
      isError: true;
      isPending: false;
      isLoading: false;
      isLoadingError: true;
      isRefetchError: false;
      isFetchNextPageError: false;
      isFetchPreviousPageError: false;
      isSuccess: false;
      isPlaceholderData: false;
      status: 'error';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    }
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: undefined;
      error: null;
      isError: false;
      isPending: true;
      isLoading: true;
      isLoadingError: false;
      isRefetchError: false;
      isFetchNextPageError: false;
      isFetchPreviousPageError: false;
      isSuccess: false;
      isPlaceholderData: false;
      status: 'pending';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    }
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: undefined;
      error: null;
      isError: false;
      isPending: true;
      isLoadingError: false;
      isRefetchError: false;
      isFetchNextPageError: false;
      isFetchPreviousPageError: false;
      isSuccess: false;
      isPlaceholderData: false;
      status: 'pending';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isLoading: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    }
  | {
      items: ItemType[];
      liveUpdatesStatus: {
        error?: any;
        status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
      };
      fetchNext: (noItems?: number) => void;
      fetchPrevious: (noItems?: number) => void;
      totalItems: number | undefined;
      isPaginated: boolean | undefined;
      data: InfiniteData<
        | {
            itemIds: never[];
            dataset: null;
            data: null;
            pageUri?: undefined;
          }
        | {
            itemIds: string[];
            dataset: null;
            pageUri: string;
            data: null;
          }
        | {
            dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
            itemIds: string[];
            pageUri: string;
            data: OrderedCollectionPage;
          },
        unknown
      >;
      isError: false;
      error: null;
      isPending: false;
      isLoading: false;
      isLoadingError: false;
      isRefetchError: false;
      isSuccess: true;
      isPlaceholderData: true;
      isFetchNextPageError: false;
      isFetchPreviousPageError: false;
      status: 'success';
      fetchNextPage: (options?: FetchNextPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<
        InfiniteQueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      dataUpdatedAt: number;
      errorUpdatedAt: number;
      failureCount: number;
      failureReason: Error | null;
      errorUpdateCount: number;
      isFetched: boolean;
      isFetchedAfterMount: boolean;
      isFetching: boolean;
      isInitialLoading: boolean;
      isPaused: boolean;
      isRefetching: boolean;
      isStale: boolean;
      isEnabled: boolean;
      refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
          InfiniteData<
            | {
                itemIds: never[];
                dataset: null;
                data: null;
                pageUri?: undefined;
              }
            | {
                itemIds: string[];
                dataset: null;
                pageUri: string;
                data: null;
              }
            | {
                dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
                itemIds: string[];
                pageUri: string;
                data: OrderedCollectionPage;
              },
            unknown
          >,
          Error
        >
      >;
      fetchStatus: FetchStatus;
      promise: Promise<
        InfiniteData<
          | {
              itemIds: never[];
              dataset: null;
              data: null;
              pageUri?: undefined;
            }
          | {
              itemIds: string[];
              dataset: null;
              pageUri: string;
              data: null;
            }
          | {
              dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
              itemIds: string[];
              pageUri: string;
              data: OrderedCollectionPage;
            },
          unknown
        >
      >;
    };
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
      error: false | (Error | null)[];
      refetch: (options?: _RefetchOptions1) => Promise<_QueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      fetchNextPage: (
        options?: _FetchNextPageOptions1
      ) => Promise<_InfiniteQueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
      error: false | (Error | null)[];
      refetch: (options?: _RefetchOptions1) => Promise<_QueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      fetchNextPage: (
        options?: _FetchNextPageOptions1
      ) => Promise<_InfiniteQueryObserverResult1<_InfiniteData1<any, unknown>, Error>>;
      addItem: (item: string | any, shouldRefetch?: boolean | number) => void;
      removeItem: (item: string | any, shouldRefetch?: boolean) => void;
      hasNextPage: boolean;
      isLoading: boolean;
      isFetching: boolean;
      isFetchingNextPage: boolean;
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
