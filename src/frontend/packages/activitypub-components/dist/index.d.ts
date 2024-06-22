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
export function useOutbox(): {
  post: (activity: any) => Promise<string | null>;
  fetch: () => Promise<any>;
  url: any;
  loaded: boolean;
  owner: import('react-admin').Identifier | undefined;
};
declare namespace _default {
  export { arrayOf };
}
export function useCollection(
  predicateOrUrl: any,
  options?: {}
): {
  items: any;
  totalItems: undefined;
  error: false | any[];
  refetch: <TPageData>(
    options?: (import('react-query').RefetchOptions & import('react-query').RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<import('react-query').QueryObserverResult<import('react-query').InfiniteData<any>, unknown>>;
  fetchNextPage: (
    options?: import('react-query').FetchNextPageOptions | undefined
  ) => Promise<import('react-query').InfiniteQueryObserverResult<any, unknown>>;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  url: any;
  hasLiveUpdates: {
    status: string;
    error: undefined;
  };
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
export function useInbox(): {
  fetch: ({ filters }: { filters: any }) => Promise<any>;
  url: any;
  owner: import('react-admin').Identifier | undefined;
};
export function useNodeinfo(host: any, rel?: string): undefined;
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
