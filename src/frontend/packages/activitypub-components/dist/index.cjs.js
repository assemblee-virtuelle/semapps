var $583VT$reactjsxruntime = require('react/jsx-runtime');
var $583VT$react = require('react');
var $583VT$reactadmin = require('react-admin');
var $583VT$rainputrichtext = require('ra-input-rich-text');
var $583VT$tiptapextensionplaceholder = require('@tiptap/extension-placeholder');
var $583VT$muimaterial = require('@mui/material');
var $583VT$muistylesmakeStyles = require('@mui/styles/makeStyles');
var $583VT$muiiconsmaterialSend = require('@mui/icons-material/Send');
var $583VT$semappssemanticdataprovider = require('@semapps/semantic-data-provider');
var $583VT$semappsauthprovider = require('@semapps/auth-provider');
var $583VT$reactquery = require('react-query');
var $583VT$tiptapcore = require('@tiptap/core');
var $583VT$tiptapextensionmention = require('@tiptap/extension-mention');
var $583VT$semappsfieldcomponents = require('@semapps/field-components');
var $583VT$tiptapreact = require('@tiptap/react');
var $583VT$tippyjs = require('tippy.js');

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, 'CommentsField', () => $2e5504cc4159ca8d$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'CollectionList', () => $505d598a33288aad$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ReferenceCollectionField', () => $b0c94a9bdea99da5$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useCollection', () => $5ca5f7e9fc1c3544$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useInbox', () => $486f741c94cd8f74$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useNodeinfo', () => $59fc2d2cba62bd8e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useOutbox', () => $456aea3814dded7d$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useWebfinger', () => $5b61553556e35016$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useMentions', () => $968ea07fb81eda0b$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ACTIVITY_TYPES', () => $ebea823cebb2f44b$export$1ec8e53e7d982d22);
$parcel$export(module.exports, 'ACTOR_TYPES', () => $ebea823cebb2f44b$export$9649665d7ccb0dc2);
$parcel$export(module.exports, 'OBJECT_TYPES', () => $ebea823cebb2f44b$export$c49cfb2681596b20);
$parcel$export(module.exports, 'PUBLIC_URI', () => $ebea823cebb2f44b$export$4d8d554031975581);
// Components

const $ebea823cebb2f44b$export$1ec8e53e7d982d22 = {
  ACCEPT: 'Accept',
  ADD: 'Add',
  ANNOUNCE: 'Announce',
  ARRIVE: 'Arrive',
  BLOCK: 'Block',
  CREATE: 'Create',
  DELETE: 'Delete',
  DISLIKE: 'Dislike',
  FLAG: 'Flag',
  FOLLOW: 'Follow',
  IGNORE: 'Ignore',
  INVITE: 'Invite',
  JOIN: 'Join',
  LEAVE: 'Leave',
  LIKE: 'Like',
  LISTEN: 'Listen',
  MOVE: 'Move',
  OFFER: 'Offer',
  QUESTION: 'Question',
  REJECT: 'Reject',
  READ: 'Read',
  REMOVE: 'Remove',
  TENTATIVE_REJECT: 'TentativeReject',
  TENTATIVE_ACCEPT: 'TentativeAccept',
  TRAVEL: 'Travel',
  UNDO: 'Undo',
  UPDATE: 'Update',
  VIEW: 'View'
};
const $ebea823cebb2f44b$export$9649665d7ccb0dc2 = {
  APPLICATION: 'Application',
  GROUP: 'Group',
  ORGANIZATION: 'Organization',
  PERSON: 'Person',
  SERVICE: 'Service'
};
const $ebea823cebb2f44b$export$c49cfb2681596b20 = {
  ARTICLE: 'Article',
  AUDIO: 'Audio',
  DOCUMENT: 'Document',
  EVENT: 'Event',
  IMAGE: 'Image',
  NOTE: 'Note',
  PAGE: 'Page',
  PLACE: 'Place',
  PROFILE: 'Profile',
  RELATIONSHIP: 'Relationship',
  TOMBSTONE: 'Tombstone',
  VIDEO: 'Video'
};
const $ebea823cebb2f44b$export$4d8d554031975581 = 'https://www.w3.org/ns/activitystreams#Public';

const $03510abb28fd3d8a$export$e57ff0f701c44363 = value => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) return [];
  // Return as is.
  if (Array.isArray(value)) return value;
  // Single value is made an array.
  return [value];
};
var $03510abb28fd3d8a$export$2e2bcd8739ae039 = {
  arrayOf: $03510abb28fd3d8a$export$e57ff0f701c44363
};
const $03510abb28fd3d8a$export$34aed805e991a647 = (iterable, predicate) => {
  const seen = new Set();
  return iterable.filter(item => {
    const key = predicate(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Used to avoid re-renders
const $5ca5f7e9fc1c3544$var$emptyArray = [];
const $5ca5f7e9fc1c3544$var$useItemsFromPages = (pages, dereferenceItems) => {
  const dataProvider = (0, $583VT$reactadmin.useDataProvider)();
  const items = (0, $583VT$react.useMemo)(
    () => pages.flatMap(p => (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(p.orderedItems || p.items)),
    [pages]
  );
  // We will force dereference, if some items are not URI string references.
  const shouldDereference = (0, $583VT$react.useMemo)(() => {
    return dereferenceItems || items.some(item => typeof item !== 'string');
  }, [dereferenceItems, items]);
  // Dereference all items, if necessary (even if shouldDereference is false, the hook needs to be called).
  const itemQueries = (0, $583VT$reactquery.useQueries)(
    !shouldDereference
      ? $5ca5f7e9fc1c3544$var$emptyArray
      : items
          .filter(item => typeof item === 'string')
          .map(itemUri => ({
            queryKey: ['resource', itemUri],
            queryFn: async () => (await dataProvider.fetch(itemUri)).json,
            staleTime: Infinity // Activities are immutable, so no need to refetch..
          }))
  );
  if (!shouldDereference)
    return {
      loadedItems: items,
      isLoading: false,
      isFetching: false
    };
  // Put all loaded items together (might be dereferenced already, so concatenate).
  const loadedItems = items
    .filter(item => typeof item !== 'string')
    .concat(
      itemQueries.flatMap(itemQuery => {
        return (itemQuery.isSuccess && itemQuery.data) || [];
      })
    );
  const errors = itemQueries.filter(q => q.error);
  return {
    loadedItems: loadedItems,
    isLoading: itemQueries.some(q => q.isLoading),
    isFetching: itemQueries.some(q => q.isFetching),
    errors: errors.length > 0 ? errors : undefined
  };
};
/**
 * Subscribe a collection. Supports pagination.
 * @param predicateOrUrl The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $5ca5f7e9fc1c3544$var$useCollection = (predicateOrUrl, options = {}) => {
  const { dereferenceItems: dereferenceItems = false, liveUpdates: liveUpdates = false } = options;
  const { data: identity } = (0, $583VT$reactadmin.useGetIdentity)();
  const [totalItems, setTotalItems] = (0, $583VT$react.useState)(0);
  const [isPaginated, setIsPaginated] = (0, $583VT$react.useState)(false); // true if the collection is paginated
  const [yieldsTotalItems, setYieldsTotalItems] = (0, $583VT$react.useState)(false); // true if the collection server yields totalItems
  const queryClient = (0, $583VT$reactquery.useQueryClient)();
  const [hasLiveUpdates, setHasLiveUpdates] = (0, $583VT$react.useState)({
    status: 'connecting'
  });
  const dataProvider = (0, $583VT$reactadmin.useDataProvider)();
  const webSocketRef = (0, $583VT$react.useRef)(null);
  // Get collectionUrl from webId predicate or URL.
  const collectionUrl = (0, $583VT$react.useMemo)(() => {
    if (predicateOrUrl) {
      if (predicateOrUrl.startsWith('http')) return predicateOrUrl;
      if (identity?.webIdData) return identity?.webIdData?.[predicateOrUrl];
    }
    return undefined;
    // throw new Error(`No URL available for useCollection: ${predicateOrUrl}.`);
  }, [identity, predicateOrUrl]);
  // Fetch page of collection item references (if pageParam provided)
  //  or default to `collectionUrl` (which should give you the first page).
  const fetchCollection = (0, $583VT$react.useCallback)(
    async ({ pageParam: nextPageUrl }) => {
      // If there is a nextPageUrl, we are fetching a page, otherwise we are fetching the first page or the collection
      const fetchingPage = !!nextPageUrl;
      // Fetch page or first page (collectionUrl)
      let { json: json } = await dataProvider.fetch(nextPageUrl || collectionUrl);
      // If we are fetching the first page or the collection, we can workout some information
      if (!fetchingPage) {
        const localIsPaginated = !!json.first || !!json.next;
        setIsPaginated(localIsPaginated);
        // If the server yields totalItems, we can use it
        if (json.totalItems) {
          setTotalItems(json.totalItems);
          setYieldsTotalItems(true);
        } else if (!localIsPaginated) {
          // If the collection is not paginated, we can count items
          const items = (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(json.orderedItems || json.items);
          if (items) setTotalItems(items.length);
        }
      }
      // If first page, handle this here.
      if ((json.type === 'OrderedCollection' || json.type === 'Collection') && json.first) {
        if (json.first?.items) {
          if (json.first?.items.length === 0 && json.first?.next)
            // Special case where the first property is an object without items
            ({ json: json } = await dataProvider.fetch(json.first?.next));
          else json = json.first;
        } // Fetch the first page
        else ({ json: json } = await dataProvider.fetch(json.first));
      }
      return json;
    },
    [dataProvider, collectionUrl, identity, setTotalItems, setIsPaginated, setYieldsTotalItems]
  );
  // Use infiniteQuery to handle pagination, fetching, etc.
  const {
    data: pageData,
    error: collectionError,
    fetchNextPage: fetchNextPage,
    refetch: refetch,
    hasNextPage: hasNextPage,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
    isFetchingNextPage: isFetchingNextPage
  } = (0, $583VT$reactquery.useInfiniteQuery)(
    [
      'collection',
      {
        collectionUrl: collectionUrl
      }
    ],
    fetchCollection,
    {
      enabled: !!(collectionUrl && identity?.id),
      getNextPageParam: lastPage => lastPage.next,
      getPreviousPageParam: firstPage => firstPage.prev
    }
  );
  // Put all items together in a list (and dereference, if required).
  const {
    loadedItems: items,
    isLoading: isLoadingItems,
    isFetching: isFetchingItems,
    errors: itemErrors
  } = $5ca5f7e9fc1c3544$var$useItemsFromPages(pageData?.pages ?? $5ca5f7e9fc1c3544$var$emptyArray, dereferenceItems);
  const allErrors = (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(collectionError).concat(
    (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(itemErrors)
  );
  const addItem = (0, $583VT$react.useCallback)(
    (item, shouldRefetch = true) => {
      queryClient.setQueryData(
        [
          'collection',
          {
            collectionUrl: collectionUrl
          }
        ],
        oldData => {
          if (!oldData) return oldData;
          // Only update totalItems if collection is not paginated or if the server yields totalItems
          if (yieldsTotalItems || !isPaginated) setTotalItems(totalItems => totalItems + 1);
          // Destructure, so react knows, it needs to re-render the pages.
          const pages = [...oldData.pages];
          if (pages?.[0]?.orderedItems)
            pages[0].orderedItems = [item, ...(0, $03510abb28fd3d8a$export$e57ff0f701c44363)(pages[0].orderedItems)];
          else if (pages?.[0]?.items)
            pages[0].items = [item, ...(0, $03510abb28fd3d8a$export$e57ff0f701c44363)(pages[0].items)];
          oldData.pages = pages;
          return oldData;
        }
      );
      if (shouldRefetch)
        setTimeout(
          () =>
            queryClient.refetchQueries(
              [
                'collection',
                {
                  collectionUrl: collectionUrl
                }
              ],
              {
                active: true,
                exact: true
              }
            ),
          typeof shouldRefetch === 'number' ? shouldRefetch : 2000
        );
    },
    [queryClient, collectionUrl, setTotalItems, isPaginated, yieldsTotalItems]
  );
  const removeItem = (0, $583VT$react.useCallback)(
    (item, shouldRefetch = true) => {
      queryClient.setQueryData(
        [
          'collection',
          {
            collectionUrl: collectionUrl
          }
        ],
        oldData => {
          if (!oldData) return oldData;
          // Only update totalItems if collection is not paginated or if the server yields totalItems
          if (yieldsTotalItems || !isPaginated) setTotalItems(totalItems => totalItems - 1);
          // Destructure, so react knows, it needs to re-render the pages array.
          const pages = [...oldData.pages];
          // Find the item in all pages and remove the item to be removed (either item.id or just item)
          pages.forEach(page => {
            if (page.orderedItems)
              page.orderedItems = (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(page.orderedItems).filter(
                i => (i.id || i) !== (item.id || item)
              );
            else if (page.items)
              page.items = (0, $03510abb28fd3d8a$export$e57ff0f701c44363)(page.items).filter(
                i => (i.id || i) !== (item?.id || item)
              );
          });
          oldData.pages = pages;
          return oldData;
        }
      );
      if (shouldRefetch)
        setTimeout(
          () =>
            queryClient.refetchQueries(
              [
                'collection',
                {
                  collectionUrl: collectionUrl
                }
              ],
              {
                active: true,
                exact: true
              }
            ),
          typeof shouldRefetch === 'number' ? shouldRefetch : 2000
        );
    },
    [queryClient, collectionUrl, setTotalItems, isPaginated, yieldsTotalItems]
  );
  // Live Updates
  (0, $583VT$react.useEffect)(() => {
    if (liveUpdates && collectionUrl)
      // Create ws that listens to collectionUri changes
      (0, $583VT$semappssemanticdataprovider.getOrCreateWsChannel)(dataProvider.fetch, collectionUrl)
        .then(ws => {
          webSocketRef.current = ws; // Keep a ref to the webSocket so that it can be used elsewhere
          webSocketRef.current.addEventListener('message', e => {
            const data = JSON.parse(e.data);
            if (data.type === 'Add') addItem(data.object, true);
            else if (data.type === 'Remove') removeItem(data.object, true);
          });
          webSocketRef.current.addEventListener('error', e => {
            setHasLiveUpdates({
              status: 'error',
              error: e
            });
            // TODO: Retry after a while
          });
          webSocketRef.current.addEventListener('close', e => {
            if (!hasLiveUpdates.error)
              setHasLiveUpdates({
                ...hasLiveUpdates,
                status: 'closed'
              });
          });
          setHasLiveUpdates({
            status: 'connected'
          });
        })
        .catch(() => {}); // If it fails, we won't receive live updates. But that's okay.
  }, [collectionUrl, liveUpdates, dataProvider, webSocketRef, addItem, removeItem, setHasLiveUpdates]);
  const awaitWebSocketConnection = (0, $583VT$react.useCallback)(
    (options = {}) => {
      const { timeout: timeout = 30000 } = options;
      if (!liveUpdates)
        throw new Error(`Cannot call awaitWebSocketConnection because the liveUpdates option is set to false`);
      return new Promise((resolve, reject) => {
        if (webSocketRef?.current) resolve(webSocketRef);
        else {
          const timeoutId = setTimeout(() => {
            reject(`No WebSocket connection found within ${Math.round(timeout / 1000)}s`);
          }, timeout);
          const intervalId = setInterval(() => {
            if (webSocketRef?.current) {
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              resolve(webSocketRef);
            } else console.log('WebSocket is not initialized yet, waiting...');
          }, 100);
        }
      });
    },
    [webSocketRef, liveUpdates]
  );
  // Construct return object conditionally
  const returnObject = {
    items: items,
    error: allErrors.length > 0 && allErrors,
    refetch: refetch,
    fetchNextPage: fetchNextPage,
    addItem: addItem,
    removeItem: removeItem,
    hasNextPage: hasNextPage,
    isLoading: isLoadingPage || isLoadingItems,
    isFetching: isFetchingPage || isFetchingItems,
    isFetchingNextPage: isFetchingNextPage,
    url: collectionUrl,
    hasLiveUpdates: hasLiveUpdates,
    awaitWebSocketConnection: awaitWebSocketConnection,
    webSocketRef: webSocketRef
  };
  // Only include totalItems if the server yields totalItems or for non-paginated collections
  if (yieldsTotalItems || !isPaginated)
    return {
      ...returnObject,
      totalItems: totalItems
    };
  return returnObject;
};
var $5ca5f7e9fc1c3544$export$2e2bcd8739ae039 = $5ca5f7e9fc1c3544$var$useCollection;

/**
 * Hook used internally by useInbox and useOutbox. This is not exported.
 * @param awaitWebSocketConnection Promise returning the WebSocket which allow to listen to the inbox or outbox
 * @param existingActivities Partial list of activities already received in the inbox and outbox
 */ const $5e70f9d0635e25dd$var$useAwaitActivity = (awaitWebSocketConnection, existingActivities) => {
  const dataProvider = (0, $583VT$reactadmin.useDataProvider)();
  // TODO Allow to pass an  object, and automatically dereference it if required, like on the @semapps/activitypub matchActivity util
  return (0, $583VT$react.useCallback)(
    (matchActivity, options = {}) => {
      const { timeout: timeout = 30000, checkExistingActivities: checkExistingActivities = false } = options;
      return new Promise((resolve, reject) => {
        awaitWebSocketConnection()
          .then(webSocketRef => {
            const onMessage = event => {
              const data = JSON.parse(event.data);
              if (data.type === 'Add')
                dataProvider.fetch(data.object).then(({ json: json }) => {
                  if (matchActivity(json)) {
                    removeListeners();
                    return resolve(json);
                  }
                });
            };
            const onError = e => {
              // TODO reconnect if connection closed
              removeListeners();
              reject(e);
            };
            const onClose = e => {
              removeListeners();
              reject(new Error(`${e.reason} (Code: ${e.code})`));
            };
            const removeListeners = () => {
              webSocketRef.current?.removeEventListener('message', onMessage);
              webSocketRef.current?.removeEventListener('error', onError);
              webSocketRef.current?.removeEventListener('close', onClose);
            };
            webSocketRef.current?.addEventListener('message', onMessage);
            webSocketRef.current?.addEventListener('error', onError);
            webSocketRef.current?.addEventListener('close', onClose);
            // If a list of activities is already loaded, verify if there is a match
            if (existingActivities && checkExistingActivities)
              for (const a of existingActivities) {
                if (typeof a !== 'string') {
                  if (matchActivity(a)) {
                    removeListeners();
                    return resolve(a);
                  }
                }
              }
            setTimeout(() => {
              removeListeners();
              reject(new Error('Timeout'));
            }, timeout);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    [awaitWebSocketConnection, existingActivities, dataProvider]
  );
};
var $5e70f9d0635e25dd$export$2e2bcd8739ae039 = $5e70f9d0635e25dd$var$useAwaitActivity;

/**
 * Hook to fetch and post to the outbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `post`: a function to post a new activity in the user's outbox
 * - `awaitActivity`: a function to wait for a certain activity to be posted
 * - `owner`: the WebID of the outbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useoutbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $456aea3814dded7d$var$useOutbox = (options = {}) => {
  const dataProvider = (0, $583VT$reactadmin.useDataProvider)();
  const { data: identity } = (0, $583VT$reactadmin.useGetIdentity)();
  const {
    url: url,
    items: items,
    awaitWebSocketConnection: awaitWebSocketConnection,
    ...rest
  } = (0, $5ca5f7e9fc1c3544$export$2e2bcd8739ae039)('outbox', options);
  const awaitActivity = (0, $5e70f9d0635e25dd$export$2e2bcd8739ae039)(awaitWebSocketConnection, items);
  // Post an activity to the logged user's outbox and return its URI
  const post = (0, $583VT$react.useCallback)(
    async activity => {
      if (!url)
        throw new Error(
          'Cannot post to outbox before user identity is loaded. Please use the isLoading argument of useOutbox'
        );
      const { headers: headers } = await dataProvider.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          '@context': 'https://www.w3.org/ns/activitystreams',
          ...activity
        })
      });
      return headers.get('Location');
    },
    [url, dataProvider]
  );
  return {
    url: url,
    items: items,
    awaitWebSocketConnection: awaitWebSocketConnection,
    post: post,
    awaitActivity: awaitActivity,
    owner: identity?.id,
    ...rest
  };
};
var $456aea3814dded7d$export$2e2bcd8739ae039 = $456aea3814dded7d$var$useOutbox;

// Fix a bug in the current version of the mention extension
// (The { id, label } object is located inside the id property)
// See https://github.com/ueberdosis/tiptap/pull/1322
const $9b1343b281972d72$var$CustomMention = (0, $parcel$interopDefault($583VT$tiptapextensionmention)).extend({
  renderHTML({ node: node, HTMLAttributes: HTMLAttributes }) {
    return [
      'span',
      (0, $583VT$tiptapcore.mergeAttributes)(this.options.HTMLAttributes, HTMLAttributes),
      `@${node.attrs.id.label}`
    ];
  },
  addAttributes() {
    return {
      label: {
        default: null,
        parseHTML: element => {
          return {
            label: element.getAttribute('data-mention-label')
          };
        },
        renderHTML: attributes => {
          if (!attributes.id.label) return {};
          return {
            'data-mention-label': attributes.id.label
          };
        }
      },
      id: {
        default: null,
        parseHTML: element => {
          return {
            id: element.getAttribute('data-mention-id')
          };
        },
        renderHTML: attributes => {
          if (!attributes.id.id) return {};
          return {
            'data-mention-id': attributes.id.id
          };
        }
      }
    };
  }
});
var $9b1343b281972d72$export$2e2bcd8739ae039 = $9b1343b281972d72$var$CustomMention;

const $703eba3e46be7ee5$var$useStyles = (0, $parcel$interopDefault($583VT$muistylesmakeStyles))(theme => ({
  form: {
    marginTop: -12 // Negative margin to keep the form close to the label
  },
  container: {
    paddingLeft: 80,
    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: 16,
    left: 0,
    bottom: 0,
    width: 64,
    height: 64
  },
  editorContent: {
    '& > div': {
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      padding: '2px 12px',
      borderWidth: '0px !important',
      borderRadius: 0,
      borderBottom: '1px solid #FFF',
      minHeight: 60,
      outline: 'unset !important'
    },
    '& > div > p': {
      marginTop: 12,
      marginBottom: 12,
      fontFamily: theme.typography.body1.fontFamily,
      marginBlockStart: '0.5em',
      marginBlockEnd: '0.5em'
    },
    '& > div > p.is-editor-empty:first-child::before': {
      color: 'grey',
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none'
    }
  },
  button: {
    marginTop: -10,
    marginBottom: 15
  }
}));
const $703eba3e46be7ee5$var$EmptyToolbar = () => null;
const $703eba3e46be7ee5$var$PostCommentForm = ({
  context: context,
  placeholder: placeholder,
  helperText: helperText,
  mentions: mentions,
  userResource: userResource,
  addItem: addItem,
  removeItem: removeItem
}) => {
  const record = (0, $583VT$reactadmin.useRecordContext)();
  const { data: identity, isLoading: isLoading } = (0, $583VT$reactadmin.useGetIdentity)();
  const userDataModel = (0, $583VT$semappssemanticdataprovider.useDataModel)(userResource);
  const classes = $703eba3e46be7ee5$var$useStyles();
  const notify = (0, $583VT$reactadmin.useNotify)();
  const outbox = (0, $456aea3814dded7d$export$2e2bcd8739ae039)();
  const [expanded, setExpanded] = (0, $583VT$react.useState)(false);
  const [openAuth, setOpenAuth] = (0, $583VT$react.useState)(false);
  const onSubmit = (0, $583VT$react.useCallback)(
    async values => {
      const document = new DOMParser().parseFromString(values.comment, 'text/html');
      const mentions = Array.from(document.body.getElementsByClassName('mention'));
      const mentionedUsersUris = [];
      mentions.forEach(node => {
        const userUri = node.attributes['data-mention-id'].value;
        const userLabel = node.attributes['data-mention-label'].value;
        const link = document.createElement('a');
        link.setAttribute(
          'href',
          `${new URL(window.location.href).origin}/${userResource}/${encodeURIComponent(userUri)}/show`
        );
        link.textContent = `@${userLabel}`;
        node.parentNode.replaceChild(link, node);
        mentionedUsersUris.push(userUri);
      });
      if (document.body.innerHTML === 'undefined')
        notify('Votre commentaire est vide', {
          type: 'error'
        });
      else {
        const tempId = Date.now();
        const note = {
          type: (0, $ebea823cebb2f44b$export$c49cfb2681596b20).NOTE,
          attributedTo: outbox.owner,
          content: document.body.innerHTML,
          inReplyTo: record[context],
          published: new Date().toISOString()
        };
        try {
          addItem({
            id: tempId,
            ...note
          });
          // TODO reset the form
          setExpanded(false);
          await outbox.post({
            ...note,
            to: [...mentionedUsersUris, (0, $ebea823cebb2f44b$export$4d8d554031975581)]
          });
          notify('Commentaire post\xe9 avec succ\xe8s', {
            type: 'success'
          });
        } catch (e) {
          console.error(e);
          removeItem(tempId);
          notify(e.message, {
            type: 'error'
          });
        }
      }
    },
    [outbox, notify, setExpanded, addItem, removeItem]
  );
  const openAuthIfDisconnected = (0, $583VT$react.useCallback)(() => {
    if (!identity?.id) setOpenAuth(true);
  }, [identity, setOpenAuth]);
  // Don't init the editor options until mentions and identity are loaded, as they can only be initialized once
  if ((mentions && !mentions.items) || isLoading) return null;
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$reactjsxruntime.Fragment), {
    children: [
      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$reactadmin.Form), {
        onSubmit: onSubmit,
        className: classes.form,
        children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$muimaterial.Box), {
          className: classes.container,
          onClick: openAuthIfDisconnected,
          children: [
            /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.Avatar), {
              src:
                identity?.webIdData?.[userDataModel?.fieldsMapping?.image] ||
                identity?.profileData?.[userDataModel?.fieldsMapping?.image],
              className: classes.avatar
            }),
            /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$rainputrichtext.RichTextInput), {
              source: 'comment',
              label: ' ',
              toolbar: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)($703eba3e46be7ee5$var$EmptyToolbar, {}),
              fullWidth: true,
              classes: {
                editorContent: classes.editorContent
              },
              editorOptions: {
                ...(0, $583VT$rainputrichtext.DefaultEditorOptions),
                onFocus() {
                  setExpanded(true);
                },
                extensions: [
                  ...(0, $583VT$rainputrichtext.DefaultEditorOptions).extensions,
                  placeholder
                    ? (0, $parcel$interopDefault($583VT$tiptapextensionplaceholder)).configure({
                        placeholder: placeholder
                      })
                    : null,
                  mentions
                    ? (0, $9b1343b281972d72$export$2e2bcd8739ae039).configure({
                        HTMLAttributes: {
                          class: 'mention'
                        },
                        suggestion: mentions
                      })
                    : null
                ],
                // Disable editor if user is not connected
                editable: !!identity?.id
              },
              helperText: helperText
            }),
            expanded &&
              /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.Button), {
                type: 'submit',
                size: 'small',
                variant: 'contained',
                color: 'primary',
                endIcon: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
                  (0, $parcel$interopDefault($583VT$muiiconsmaterialSend)),
                  {}
                ),
                className: classes.button,
                children: 'Envoyer'
              })
          ]
        })
      }),
      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$semappsauthprovider.AuthDialog), {
        open: openAuth,
        onClose: () => setOpenAuth(false),
        message: 'Pour poster un commentaire, vous devez \xeatre connect\xe9.'
      })
    ]
  });
};
var $703eba3e46be7ee5$export$2e2bcd8739ae039 = $703eba3e46be7ee5$var$PostCommentForm;

const $d68cd57b2d06b6d5$var$useStyles = (0, $parcel$interopDefault($583VT$muistylesmakeStyles))(() => ({
  container: {
    paddingLeft: 80,
    marginTop: 8,
    minHeight: 80,
    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 64,
    height: 64
  },
  text: {
    paddingTop: 2,
    paddingBottom: 8
  },
  label: {
    fontWeight: 'bold'
  },
  content: {
    '& p': {
      marginBlockStart: '0.5em',
      marginBlockEnd: '0.5em'
    }
  },
  loading: {
    zIndex: 1000,
    backgroundColor: 'white',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginTop: 5
  }
}));
const $d68cd57b2d06b6d5$var$CommentsList = ({ comments: comments, userResource: userResource, loading: loading }) => {
  const classes = $d68cd57b2d06b6d5$var$useStyles();
  const userDataModel = (0, $583VT$semappssemanticdataprovider.useDataModel)(userResource);
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$muimaterial.Box), {
    position: 'relative',
    children: [
      comments &&
        comments
          .sort((a, b) => new Date(b.published) - new Date(a.published))
          .map(comment =>
            /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)(
              (0, $583VT$muimaterial.Box),
              {
                className: classes.container,
                children: [
                  /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.Box), {
                    className: classes.avatar,
                    children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
                      (0, $583VT$semappsfieldcomponents.ReferenceField),
                      {
                        record: comment,
                        reference: userResource,
                        source: 'attributedTo',
                        linkType: 'show',
                        children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
                          (0, $583VT$semappsfieldcomponents.AvatarWithLabelField),
                          {
                            image: userDataModel?.fieldsMapping?.image
                          }
                        )
                      }
                    )
                  }),
                  /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$muimaterial.Box), {
                    className: classes.text,
                    children: [
                      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$muimaterial.Typography), {
                        variant: 'body2',
                        children: [
                          /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
                            (0, $583VT$semappsfieldcomponents.ReferenceField),
                            {
                              record: comment,
                              reference: userResource,
                              source: 'attributedTo',
                              linkType: 'show',
                              children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
                                (0, $583VT$reactadmin.TextField),
                                {
                                  variant: 'body2',
                                  source: userDataModel?.fieldsMapping?.title,
                                  className: classes.label
                                }
                              )
                            }
                          ),
                          '\xa0\u2022\xa0',
                          /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$reactadmin.DateField), {
                            record: comment,
                            variant: 'body2',
                            source: 'published',
                            showTime: true
                          })
                        ]
                      }),
                      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$reactadmin.RichTextField), {
                        record: comment,
                        variant: 'body1',
                        source: 'content',
                        className: classes.content
                      })
                    ]
                  })
                ]
              },
              comment.id
            )
          ),
      loading &&
        /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.Box), {
          minHeight: 200,
          children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.Box), {
            alignItems: 'center',
            className: classes.loading,
            children: /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$muimaterial.CircularProgress), {
              size: 60,
              thickness: 6
            })
          })
        })
    ]
  });
};
var $d68cd57b2d06b6d5$export$2e2bcd8739ae039 = $d68cd57b2d06b6d5$var$CommentsList;

const $2e5504cc4159ca8d$var$CommentsField = ({
  source: source,
  context: context,
  helperText: helperText,
  placeholder: placeholder,
  userResource: userResource,
  mentions: mentions
}) => {
  const record = (0, $583VT$reactadmin.useRecordContext)();
  const {
    items: comments,
    loading: loading,
    addItem: addItem,
    removeItem: removeItem
  } = (0, $5ca5f7e9fc1c3544$export$2e2bcd8739ae039)(record.replies);
  if (!userResource) throw new Error('No userResource defined for CommentsField');
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsxs)((0, $583VT$reactjsxruntime.Fragment), {
    children: [
      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $703eba3e46be7ee5$export$2e2bcd8739ae039), {
        context: context,
        helperText: helperText,
        userResource: userResource,
        placeholder: placeholder,
        mentions: mentions,
        addItem: addItem,
        removeItem: removeItem
      }),
      /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $d68cd57b2d06b6d5$export$2e2bcd8739ae039), {
        comments: comments,
        loading: loading,
        userResource: userResource
      })
    ]
  });
};
$2e5504cc4159ca8d$var$CommentsField.defaultProps = {
  label: 'Commentaires',
  placeholder: 'Commencez \xe0 taper votre commentaire...',
  source: 'id',
  context: 'id'
};
var $2e5504cc4159ca8d$export$2e2bcd8739ae039 = $2e5504cc4159ca8d$var$CommentsField;

const $505d598a33288aad$var$CollectionList = ({
  collectionUrl: collectionUrl,
  resource: resource,
  children: children
}) => {
  if ((0, $parcel$interopDefault($583VT$react)).Children.count(children) !== 1)
    throw new Error('<CollectionList> only accepts a single child');
  const { items: actorsUris } = (0, $5ca5f7e9fc1c3544$export$2e2bcd8739ae039)(collectionUrl);
  const {
    data: data,
    isLoading: isLoading,
    isFetching: isFetching
  } = (0, $583VT$reactadmin.useGetMany)(
    resource,
    {
      ids: Array.isArray(actorsUris) ? actorsUris : [actorsUris]
    },
    {
      enabled: !!actorsUris
    }
  );
  const listContext = (0, $583VT$reactadmin.useList)({
    data: data,
    isLoading: isLoading,
    isFetching: isFetching
  });
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $583VT$reactadmin.ListContextProvider), {
    value: listContext,
    children: children
  });
};
var $505d598a33288aad$export$2e2bcd8739ae039 = $505d598a33288aad$var$CollectionList;

const $b0c94a9bdea99da5$var$ReferenceCollectionField = ({
  source: source,
  reference: reference,
  children: children,
  ...rest
}) => {
  const record = (0, $583VT$reactadmin.useRecordContext)();
  if ((0, $parcel$interopDefault($583VT$react)).Children.count(children) !== 1)
    throw new Error('<ReferenceCollectionField> only accepts a single child');
  if (!record || !record[source]) return null;
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)((0, $505d598a33288aad$export$2e2bcd8739ae039), {
    resource: reference,
    collectionUrl: record[source],
    ...rest,
    children: children
  });
};
var $b0c94a9bdea99da5$export$2e2bcd8739ae039 = $b0c94a9bdea99da5$var$ReferenceCollectionField;

/**
 * Hook to fetch the inbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `awaitActivity`: a function to wait for a certain activity to be received
 * - `owner`: the WebID of the inbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useinbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $486f741c94cd8f74$var$useInbox = (options = {}) => {
  const { data: identity } = (0, $583VT$reactadmin.useGetIdentity)();
  const {
    url: url,
    items: items,
    awaitWebSocketConnection: awaitWebSocketConnection,
    ...rest
  } = (0, $5ca5f7e9fc1c3544$export$2e2bcd8739ae039)('inbox', options);
  const awaitActivity = (0, $5e70f9d0635e25dd$export$2e2bcd8739ae039)(awaitWebSocketConnection, items);
  return {
    url: url,
    items: items,
    awaitWebSocketConnection: awaitWebSocketConnection,
    awaitActivity: awaitActivity,
    owner: identity?.id,
    ...rest
  };
};
var $486f741c94cd8f74$export$2e2bcd8739ae039 = $486f741c94cd8f74$var$useInbox;

const $59fc2d2cba62bd8e$var$useNodeinfo = (host, rel = 'http://nodeinfo.diaspora.software/ns/schema/2.1') => {
  const [schema, setSchema] = (0, $583VT$react.useState)();
  (0, $583VT$react.useEffect)(() => {
    (async () => {
      if (host && rel) {
        const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are likely on HTTP
        const nodeinfoUrl = `${protocol}://${host}/.well-known/nodeinfo`;
        try {
          const { json: links } = await (0, $583VT$reactadmin.fetchUtils).fetchJson(nodeinfoUrl);
          // Accept any version of the nodeinfo protocol
          const link = links?.links?.find(l => l.rel === rel);
          if (link) {
            const { json: json } = await (0, $583VT$reactadmin.fetchUtils).fetchJson(link.href);
            setSchema(json);
          }
        } catch (e) {
          // Do nothing if nodeinfo can't be fetched
        }
      }
    })();
  }, [host, setSchema, rel]);
  return schema;
};
var $59fc2d2cba62bd8e$export$2e2bcd8739ae039 = $59fc2d2cba62bd8e$var$useNodeinfo;

const $5b61553556e35016$var$useWebfinger = () => {
  // Post an activity to the logged user's outbox and return its URI
  const fetch = (0, $583VT$react.useCallback)(async id => {
    // eslint-disable-next-line
    const [_, username, host] = id.split('@');
    if (host) {
      const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are most likely on localhost
      const webfingerUrl = `${protocol}://${host}/.well-known/webfinger?resource=acct:${username}@${host}`;
      try {
        const { json: json } = await (0, $583VT$reactadmin.fetchUtils).fetchJson(webfingerUrl);
        const link = json.links.find(l => l.type === 'application/activity+json');
        return link ? link.href : null;
      } catch (e) {
        return null;
      }
    } else return null;
  }, []);
  return {
    fetch: fetch
  };
};
var $5b61553556e35016$export$2e2bcd8739ae039 = $5b61553556e35016$var$useWebfinger;

const $27d3788851661769$var$useStyles = (0, $parcel$interopDefault($583VT$muistylesmakeStyles))(theme => ({
  items: {
    background: '#fff',
    borderRadius: '0.5rem',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '0.9rem',
    overflow: 'hidden',
    padding: '0.2rem',
    position: 'relative'
  },
  item: {
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '0.4rem',
    display: 'block',
    margin: 0,
    padding: '0.2rem 0.4rem',
    textAlign: 'left',
    width: '100%',
    '&.selected': {
      borderColor: '#000'
    }
  }
}));
var $27d3788851661769$export$2e2bcd8739ae039 = /*#__PURE__*/ (0, $583VT$react.forwardRef)((props, ref) => {
  const [selectedIndex, setSelectedIndex] = (0, $583VT$react.useState)(0);
  const classes = $27d3788851661769$var$useStyles();
  const selectItem = index => {
    const item = props.items[index];
    if (item)
      props.command({
        id: item
      });
  };
  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };
  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };
  const enterHandler = () => {
    selectItem(selectedIndex);
  };
  (0, $583VT$react.useEffect)(() => setSelectedIndex(0), [props.items]);
  (0, $583VT$react.useImperativeHandle)(ref, () => ({
    onKeyDown: ({ event: event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    }
  }));
  return /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)('div', {
    className: classes.items,
    children: props.items.length
      ? props.items.map((item, index) =>
          /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)(
            'button',
            {
              className: classes.item + (index === selectedIndex ? ' selected' : ''),
              onClick: () => selectItem(index),
              children: item.label
            },
            index
          )
        )
      : /*#__PURE__*/ (0, $583VT$reactjsxruntime.jsx)('div', {
          className: classes.item,
          children: 'Aucun r\xe9sultat'
        })
  });
});

const $7b7f4b18327176f8$var$renderMentions = () => {
  let component;
  let popup;
  return {
    onStart: props => {
      component = new (0, $583VT$tiptapreact.ReactRenderer)((0, $27d3788851661769$export$2e2bcd8739ae039), {
        props: props,
        editor: props.editor
      });
      popup = (0, $parcel$interopDefault($583VT$tippyjs))('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      });
    },
    onUpdate(props) {
      component.updateProps(props);
      popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown(props) {
      if (props.event.key === 'Escape') {
        popup[0].hide();
        return true;
      }
      return component.ref?.onKeyDown(props);
    },
    onExit() {
      popup[0].destroy();
      component.destroy();
    }
  };
};
var $7b7f4b18327176f8$export$2e2bcd8739ae039 = $7b7f4b18327176f8$var$renderMentions;

const $968ea07fb81eda0b$var$useMentions = userResource => {
  const userDataModel = (0, $583VT$semappssemanticdataprovider.useDataModel)(userResource);
  const { data: data } = (0, $583VT$reactadmin.useGetList)(
    userResource,
    {
      filter: {
        _predicates: [userDataModel?.fieldsMapping?.title],
        blankNodes: []
      }
    },
    {
      enabled: !!userDataModel?.fieldsMapping?.title
    }
  );
  const availableMentions = (0, $583VT$react.useMemo)(() => {
    if (data)
      return data.map(item => ({
        id: item.id,
        label: item[userDataModel?.fieldsMapping?.title]
      }));
  }, [data]);
  const items = (0, $583VT$react.useMemo)(() => {
    if (availableMentions)
      return ({ query: query }) => {
        return availableMentions
          .filter(({ label: label }) => label.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5);
      };
  }, [availableMentions]);
  return {
    items: items,
    render: (0, $7b7f4b18327176f8$export$2e2bcd8739ae039)
  };
};
var $968ea07fb81eda0b$export$2e2bcd8739ae039 = $968ea07fb81eda0b$var$useMentions;

//# sourceMappingURL=index.cjs.js.map
