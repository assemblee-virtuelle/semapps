import {jsxs as $85cNH$jsxs, Fragment as $85cNH$Fragment, jsx as $85cNH$jsx} from "react/jsx-runtime";
import $85cNH$react, {useState as $85cNH$useState, useCallback as $85cNH$useCallback, useMemo as $85cNH$useMemo, useRef as $85cNH$useRef, useEffect as $85cNH$useEffect, forwardRef as $85cNH$forwardRef, useImperativeHandle as $85cNH$useImperativeHandle} from "react";
import {useRecordContext as $85cNH$useRecordContext, useGetIdentity as $85cNH$useGetIdentity, useNotify as $85cNH$useNotify, Form as $85cNH$Form, useDataProvider as $85cNH$useDataProvider, TextField as $85cNH$TextField, DateField as $85cNH$DateField, RichTextField as $85cNH$RichTextField, useGetMany as $85cNH$useGetMany, useList as $85cNH$useList, ListContextProvider as $85cNH$ListContextProvider, fetchUtils as $85cNH$fetchUtils, useGetList as $85cNH$useGetList} from "react-admin";
import {RichTextInput as $85cNH$RichTextInput, DefaultEditorOptions as $85cNH$DefaultEditorOptions} from "ra-input-rich-text";
import $85cNH$tiptapextensionplaceholder from "@tiptap/extension-placeholder";
import {makeStyles as $85cNH$makeStyles, Box as $85cNH$Box, Avatar as $85cNH$Avatar, Button as $85cNH$Button, Typography as $85cNH$Typography, CircularProgress as $85cNH$CircularProgress} from "@mui/material";
import $85cNH$muiiconsmaterialSend from "@mui/icons-material/Send";
import {useDataModel as $85cNH$useDataModel, getOrCreateWsChannel as $85cNH$getOrCreateWsChannel} from "@semapps/semantic-data-provider";
import {AuthDialog as $85cNH$AuthDialog} from "@semapps/auth-provider";
import {useQueries as $85cNH$useQueries, useQueryClient as $85cNH$useQueryClient, useInfiniteQuery as $85cNH$useInfiniteQuery} from "@tanstack/react-query";
import $85cNH$jsonld from "jsonld";
import $85cNH$rdfext from "rdf-ext";
import $85cNH$rdfjsparsern3 from "@rdfjs/parser-n3";
import {Readable as $85cNH$Readable} from "stream";
import {Validator as $85cNH$Validator} from "shacl-engine";
import {ActivityStreamsShape as $85cNH$ActivityStreamsShape} from "@activitypods/shape-definitions";
import {ReadableWebToNodeStream as $85cNH$ReadableWebToNodeStream} from "readable-web-to-node-stream";
import {mergeAttributes as $85cNH$mergeAttributes} from "@tiptap/core";
import $85cNH$tiptapextensionmention from "@tiptap/extension-mention";
import {ReferenceField as $85cNH$ReferenceField, AvatarWithLabelField as $85cNH$AvatarWithLabelField} from "@semapps/field-components";
import {createConnectedLdoDataset as $85cNH$createConnectedLdoDataset} from "@ldo/connected";
import {solidConnectedPlugin as $85cNH$solidConnectedPlugin} from "@ldo/connected-solid";
import {OrderedCollectionPageShapeType as $85cNH$OrderedCollectionPageShapeType} from "@activitypods/ldo-shapes";
import {ReactRenderer as $85cNH$ReactRenderer} from "@tiptap/react";
import $85cNH$tippyjs from "tippy.js";

// Components












const $cb5f912aee8137fc$export$1ec8e53e7d982d22 = {
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
const $cb5f912aee8137fc$export$9649665d7ccb0dc2 = {
    APPLICATION: 'Application',
    GROUP: 'Group',
    ORGANIZATION: 'Organization',
    PERSON: 'Person',
    SERVICE: 'Service'
};
const $cb5f912aee8137fc$export$c49cfb2681596b20 = {
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
const $cb5f912aee8137fc$export$4d8d554031975581 = 'https://www.w3.org/ns/activitystreams#Public';












const $577f4953dfa5de4f$export$e57ff0f701c44363 = (value)=>{
    // If the field is null-ish, we suppose there are no values.
    if (value === null || value === undefined) return [];
    // Return as is.
    if (Array.isArray(value)) return value;
    // Single value is made an array.
    return [
        value
    ];
};
var $577f4953dfa5de4f$export$2e2bcd8739ae039 = {
    arrayOf: $577f4953dfa5de4f$export$e57ff0f701c44363
};
const $577f4953dfa5de4f$export$34aed805e991a647 = (iterable, predicate)=>{
    const seen = new Set();
    return iterable.filter((item)=>{
        const key = predicate(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};
const $577f4953dfa5de4f$export$2684df65fa35e98e = async (jsonLdObject)=>{
    // Convert JSON-LD object to N-Quads string
    const nquads = await (0, $85cNH$jsonld).toRDF(jsonLdObject, {
        format: 'application/n-quads'
    });
    // Parse N-Quads string to RDF/JS quads
    const parser = new (0, $85cNH$rdfjsparsern3)();
    const quadStream = parser.import((0, $85cNH$Readable).from([
        nquads
    ]));
    const dataset = await (0, $85cNH$rdfext).dataset().import(quadStream);
    return dataset;
};
const $577f4953dfa5de4f$export$7089f01fea2fc5c2 = async (jsonLdObject)=>{
    // Convert JSON-LD object to N-Quads string
    const nquads = await (0, $85cNH$jsonld).toRDF(jsonLdObject, {
        format: 'application/n-quads'
    });
    // Parse N-Quads string to RDF/JS quads
    const parser = new (0, $85cNH$rdfjsparsern3)();
    const quadStream = parser.import((0, $85cNH$Readable).from([
        nquads
    ]));
    // Convert the quad stream to an array of quads
    const quads = [];
    quadStream.on('data', (quad)=>{
        quads.push(quad);
    });
    return new Promise((resolve, reject)=>{
        quadStream.on('end', ()=>{
            resolve(quads);
        });
        quadStream.on('error', (error)=>{
            reject(error);
        });
    });
};









// Helper function to convert a string to a Node.js Readable stream
const $58194f7610fd9353$export$7b2e5d6b7377fcaf = (str)=>{
    // Create a TextEncoder to convert string to Uint8Array
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(str);
    // Create a ReadableStream from the Uint8Array
    const readableStream = new ReadableStream({
        start (controller) {
            controller.enqueue(uint8Array);
            controller.close();
        }
    });
    // Convert the web ReadableStream to a Node.js Readable stream
    return new (0, $85cNH$ReadableWebToNodeStream)(readableStream);
};
const $58194f7610fd9353$export$7304a15200aa09e5 = async (turtleData)=>{
    // Convert Turtle data to a stream
    const textStream = $58194f7610fd9353$export$7b2e5d6b7377fcaf(turtleData);
    // Use ParserN3 which outputs rdf-ext compatible quads directly
    const parser = new (0, $85cNH$rdfjsparsern3)({
        factory: (0, $85cNH$rdfext)
    });
    const quadStream = parser.import(textStream);
    const dataset = await (0, $85cNH$rdfext).dataset().import(quadStream);
    return dataset;
};


// Cache of SHACL validators
const $25cb6caf33e2f460$var$validatorCache = {};
/**
 * Returns a SHACL validator for ActivityStreams shapes.
 *
 * This function creates a SHACL validator for ActivityStreams shapes using the
 * `@activitypods/shape-definitions` package. It caches the validator to avoid
 * creating it multiple times.
 *
 * @returns A Promise that resolves to a SHACL Validator instance.
 */ const $25cb6caf33e2f460$export$8b707c2a07270e94 = async ()=>{
    // Check if the validator is already cached
    if ($25cb6caf33e2f460$var$validatorCache.activityStreams) return $25cb6caf33e2f460$var$validatorCache.activityStreams;
    try {
        const shapeDataset = await (0, $58194f7610fd9353$export$7304a15200aa09e5)((0, $85cNH$ActivityStreamsShape));
        // Create and cache the SHACL validator using the dataset
        $25cb6caf33e2f460$var$validatorCache.activityStreams = new (0, $85cNH$Validator)(shapeDataset, {
            factory: (0, $85cNH$rdfext),
            debug: true
        });
        return $25cb6caf33e2f460$var$validatorCache.activityStreams;
    } catch (error) {
        throw new Error(`Failed to create ActivityStreams validator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    const shapeDataset = await (0, $58194f7610fd9353$export$7304a15200aa09e5)((0, $85cNH$ActivityStreamsShape));
    // Create and cache the SHACL validator using the dataset
    $25cb6caf33e2f460$var$validatorCache.activityStreams = new (0, $85cNH$Validator)(shapeDataset, {
        factory: (0, $85cNH$rdfext),
        debug: true
    });
    return $25cb6caf33e2f460$var$validatorCache.activitystreams;
};
// Helper function to load a SHACL shape and return a validator
const $25cb6caf33e2f460$export$6de257db5bb9fd74 = async (shapeUri)=>{
    // Check if the validator is already cached
    if ($25cb6caf33e2f460$var$validatorCache[shapeUri]) return $25cb6caf33e2f460$var$validatorCache[shapeUri];
    try {
        const response = await fetch(shapeUri, {
            headers: {
                Accept: 'text/turtle'
            }
        });
        if (!response.ok) throw new Error(`Failed to load shape: ${response.status} ${response.statusText}`);
        // Get the Turtle data as text
        const turtleData = await response.text();
        const shapeDataset = await (0, $58194f7610fd9353$export$7304a15200aa09e5)(turtleData);
        // Create and cache the SHACL validator using the dataset
        $25cb6caf33e2f460$var$validatorCache[shapeUri] = new (0, $85cNH$Validator)(shapeDataset, {
            factory: (0, $85cNH$rdfext)
        });
        return $25cb6caf33e2f460$var$validatorCache[shapeUri];
    } catch (error) {
        throw new Error(`Failed to create SHACL validator for ${shapeUri}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
/**
 * Validates an array of items against a SHACL shape and returns the validation results.
 *
 * @param items The items to validate
 * @param shaclValidator The SHACL validator to use
 * @param context The context to use for the items
 *
 * @returns An array of objects containing the item and its validation result
 */ const $25cb6caf33e2f460$export$1558e55ae3912bbb = async (items, shaclValidator, context)=>{
    if (!shaclValidator) throw new Error('validateItems: shaclValidator is required');
    return Promise.all(items.map(async (item)=>{
        try {
            if (!item['@context']) item['@context'] = context;
            // Create a dataset from the item's JSON-LD
            const itemDataset = await (0, $577f4953dfa5de4f$export$2684df65fa35e98e)(item);
            // Validate against the SHACL shape
            const report = shaclValidator.validate({
                dataset: itemDataset
            });
            return {
                item: item,
                isValid: report.conforms
            };
        } catch (error) {
            return {
                item: item,
                isValid: false,
                error: error
            };
        }
    }));
};
/**
 * Validates a subject against a set of SHACL shapes and returns the typed item if valid.
 *
 * @param subjectUri The subject to validate
 * @param dataset The dataset containing the subject
 * @param shapeTypes The shape types to validate against
 * @param validator The SHACL validator to use
 *
 * @returns A typed item if valid, or null if not valid
 */ const $25cb6caf33e2f460$export$c4cb1062f0ffb837 = async (subjectUri, dataset, shapeTypes, validator)=>{
    const validationReport = await validator.validate(// Terms means the entry point from which should be validated, in our case the current item.
    {
        dataset: dataset,
        terms: [
            (0, $85cNH$rdfext).namedNode(subjectUri)
        ]
    }, // Here, terms means the shapes to validate against.
    {
        terms: shapeTypes.map((shapeType)=>(0, $85cNH$rdfext).namedNode(shapeType.shape))
    });
    if (!validationReport.conforms) return null;
    const { results: results } = validationReport;
    // Find the shape that matched the item in the report results.
    const shapeType = shapeTypes.find((st)=>results.find((res)=>res.focusNode === subjectUri && res.shape === st.shape));
    if (!shapeType) return null;
    const typedItem = dataset.usingType(shapeType).fromSubject(subjectUri);
    return typedItem;
};


// Used to avoid re-renders
const $8281f3ce3b9d6123$var$emptyArray = [];
const $8281f3ce3b9d6123$var$useItemsFromPages = (pages, dereferenceItems)=>{
    const dataProvider = (0, $85cNH$useDataProvider)();
    const items = (0, $85cNH$useMemo)(()=>pages.flatMap((p)=>(0, $577f4953dfa5de4f$export$e57ff0f701c44363)(p.orderedItems || p.items)), [
        pages
    ]);
    // We will force dereference, if some items are not URI string references.
    const shouldDereference = (0, $85cNH$useMemo)(()=>{
        return dereferenceItems || items.some((item)=>typeof item !== 'string');
    }, [
        dereferenceItems,
        items
    ]);
    // Dereference all items, if necessary (even if shouldDereference is false, the hook needs to be called).
    const itemQueries = (0, $85cNH$useQueries)({
        queries: !shouldDereference ? $8281f3ce3b9d6123$var$emptyArray : items.filter((item)=>typeof item === 'string').map((itemUri)=>({
                queryKey: [
                    'resource',
                    itemUri
                ],
                queryFn: async ()=>(await dataProvider.fetch(itemUri)).json,
                // TODO: Collections don't have to contain activities only, do they?
                staleTime: Infinity // Activities are immutable, so no need to refetch..
            }))
    });
    if (!shouldDereference) return {
        loadedItems: items,
        isLoading: false,
        isFetching: false
    };
    // Put all loaded items together (might be dereferenced already, so concatenate).
    const loadedItems = items.filter((item)=>typeof item !== 'string').concat(itemQueries.flatMap((itemQuery)=>{
        return itemQuery.isSuccess && itemQuery.data || [];
    }));
    const errors = itemQueries.filter((q)=>q.error);
    return {
        loadedItems: loadedItems,
        isLoading: itemQueries.some((q)=>q.isLoading),
        isFetching: itemQueries.some((q)=>q.isFetching),
        errors: errors.length > 0 ? errors : undefined
    };
};
/**
 * Subscribe toa collection. Supports pagination.
 * @param predicateOrUrl The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $8281f3ce3b9d6123$var$useCollection = (predicateOrUrl, options = {})=>{
    const { dereferenceItems: dereferenceItems = false, liveUpdates: liveUpdates = false, shaclShapeUri: shaclShapeUri = '' } = options;
    const { data: identity } = (0, $85cNH$useGetIdentity)();
    const [totalItems, setTotalItems] = (0, $85cNH$useState)(0);
    const [isPaginated, setIsPaginated] = (0, $85cNH$useState)(false); // true if the collection is paginated
    const [yieldsTotalItems, setYieldsTotalItems] = (0, $85cNH$useState)(false); // true if the collection server yields totalItems
    const queryClient = (0, $85cNH$useQueryClient)();
    const [hasLiveUpdates, setHasLiveUpdates] = (0, $85cNH$useState)({
        status: 'connecting'
    });
    const dataProvider = (0, $85cNH$useDataProvider)();
    const webSocketRef = (0, $85cNH$useRef)(null);
    // Get collectionUrl from webId predicate or URL.
    const collectionUrl = (0, $85cNH$useMemo)(()=>{
        if (predicateOrUrl) {
            if (predicateOrUrl.startsWith('http') || predicateOrUrl.startsWith('did:ng:')) return predicateOrUrl;
            if (identity?.webIdData) return identity?.webIdData?.[predicateOrUrl];
        }
        return undefined;
    // throw new Error(`No URL available for useCollection: ${predicateOrUrl}.`);
    }, [
        identity,
        predicateOrUrl
    ]);
    // Fetch page of collection item references (if pageParam provided)
    //  or default to `collectionUrl` (which should give you the first page).
    const fetchCollection = (0, $85cNH$useCallback)(async ({ pageParam: nextPageUrl })=>{
        // If there is a nextPageUrl, we are fetching a page, otherwise we are fetching the first page or the collection
        const fetchingPage = !!nextPageUrl;
        // Fetch page or first page (collectionUrl)
        let { json: json } = await dataProvider.fetch(nextPageUrl || collectionUrl);
        // If first page, handle this here.
        if ((json.type === 'OrderedCollection' || json.type === 'Collection') && json.first) {
            const firstItems = json.first?.items || json.first?.orderedItems;
            if (firstItems) {
                if (firstItems.length === 0 && json.first?.next) // Special case where the first property is an object without items
                ({ json: json } = await dataProvider.fetch(json.first?.next));
                else // Add the @context to the json, so that it can be used to expand the items
                // That is necessary for the validation of the items
                json = {
                    '@context': json['@context'],
                    ...json.first
                };
            } else // Fetch the first page
            ({ json: json } = await dataProvider.fetch(json.first));
        }
        const itemsKey = json.orderedItems ? 'orderedItems' : 'items';
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
                const items = (0, $577f4953dfa5de4f$export$e57ff0f701c44363)(json[itemsKey]);
                if (items) setTotalItems(items.length);
            }
        }
        // Validate the json with the SHACL shape
        if (shaclShapeUri !== '' && json[itemsKey] && json[itemsKey].length > 0) try {
            if (!json['@context']) throw new Error(`No context returned by the server.\nA context is required to expand the collection's items and validate them.`);
            // TODO: Research: Is this used with the multi-purpose viewer already?
            // How can multiple shapes be validated? Can we get this typed here?
            const shaclValidator = await (0, $25cb6caf33e2f460$export$6de257db5bb9fd74)(shaclShapeUri);
            const validatedResults = await (0, $25cb6caf33e2f460$export$1558e55ae3912bbb)((0, $577f4953dfa5de4f$export$e57ff0f701c44363)(json[itemsKey]), shaclValidator, json['@context']);
            // Keep only the valid item in the collection
            json[itemsKey] = validatedResults.filter((result)=>result.isValid).map((result)=>result.item);
        } catch (error) {
            console.warn(`Filtering of the collection's items using SHACL validation wasn't possible.\n${collectionUrl}`, error);
        }
        return json;
    }, [
        dataProvider,
        collectionUrl,
        identity,
        setTotalItems,
        setIsPaginated,
        setYieldsTotalItems,
        shaclShapeUri
    ]);
    // Use infiniteQuery to handle pagination, fetching, etc.
    const { data: pageData, error: collectionError, fetchNextPage: fetchNextPage, refetch: refetch, hasNextPage: hasNextPage, isLoading: isLoadingPage, isFetching: isFetchingPage, isFetchingNextPage: isFetchingNextPage } = (0, $85cNH$useInfiniteQuery)({
        queryKey: [
            'collection',
            {
                collectionUrl: collectionUrl,
                shaclShapeUri: shaclShapeUri
            }
        ],
        enabled: !!(collectionUrl && identity?.id),
        initialPageParam: collectionUrl,
        getNextPageParam: (lastPage)=>lastPage.next,
        getPreviousPageParam: (firstPage)=>firstPage.prev,
        queryFn: fetchCollection
    });
    // Put all items together in a list (and dereference, if required).
    const { loadedItems: items, isLoading: isLoadingItems, isFetching: isFetchingItems, errors: itemErrors } = $8281f3ce3b9d6123$var$useItemsFromPages(pageData?.pages ?? $8281f3ce3b9d6123$var$emptyArray, dereferenceItems);
    const allErrors = (0, $577f4953dfa5de4f$export$e57ff0f701c44363)(collectionError).concat((0, $577f4953dfa5de4f$export$e57ff0f701c44363)(itemErrors));
    const addItem = (0, $85cNH$useCallback)((item, shouldRefetch = true)=>{
        queryClient.setQueryData([
            'collection',
            {
                collectionUrl: collectionUrl
            }
        ], (oldData)=>{
            if (!oldData) return oldData;
            // Only update totalItems if collection is not paginated or if the server yields totalItems
            if (yieldsTotalItems || !isPaginated) setTotalItems((totalItems)=>totalItems + 1);
            // Destructure, so react knows, it needs to re-render the pages.
            const pages = [
                ...oldData.pages
            ];
            if (pages?.[0]?.orderedItems) pages[0].orderedItems = [
                item,
                ...(0, $577f4953dfa5de4f$export$e57ff0f701c44363)(pages[0].orderedItems)
            ];
            else if (pages?.[0]?.items) pages[0].items = [
                item,
                ...(0, $577f4953dfa5de4f$export$e57ff0f701c44363)(pages[0].items)
            ];
            oldData.pages = pages;
            return oldData;
        });
        if (shouldRefetch) setTimeout(async ()=>queryClient.refetchQueries({
                queryKey: [
                    'collection',
                    {
                        collectionUrl: collectionUrl
                    }
                ],
                type: 'active',
                exact: true
            }), typeof shouldRefetch === 'number' ? shouldRefetch : 2000);
    }, [
        queryClient,
        collectionUrl,
        setTotalItems,
        isPaginated,
        yieldsTotalItems
    ]);
    const removeItem = (0, $85cNH$useCallback)((item, shouldRefetch = true)=>{
        queryClient.setQueryData([
            'collection',
            {
                collectionUrl: collectionUrl
            }
        ], (oldData)=>{
            if (!oldData) return oldData;
            // Only update totalItems if collection is not paginated or if the server yields totalItems
            if (yieldsTotalItems || !isPaginated) setTotalItems((totalItems)=>totalItems - 1);
            // Destructure, so react knows, it needs to re-render the pages array.
            const pages = [
                ...oldData.pages
            ];
            // Find the item in all pages and remove the item to be removed (either item.id or just item)
            pages.forEach((page)=>{
                if (page.orderedItems) page.orderedItems = (0, $577f4953dfa5de4f$export$e57ff0f701c44363)(page.orderedItems).filter((i)=>(i.id || i) !== (item.id || item));
                else if (page.items) page.items = (0, $577f4953dfa5de4f$export$e57ff0f701c44363)(page.items).filter((i)=>(i.id || i) !== (item?.id || item));
            });
            oldData.pages = pages;
            return oldData;
        });
        if (shouldRefetch) setTimeout(()=>queryClient.refetchQueries({
                queryKey: [
                    'collection',
                    {
                        collectionUrl: collectionUrl
                    }
                ],
                type: 'active',
                exact: true
            }), typeof shouldRefetch === 'number' ? shouldRefetch : 2000);
    }, [
        queryClient,
        collectionUrl,
        setTotalItems,
        isPaginated,
        yieldsTotalItems
    ]);
    // Live Updates
    (0, $85cNH$useEffect)(()=>{
        if (liveUpdates && collectionUrl) // Create ws that listens to collectionUri changes
        (0, $85cNH$getOrCreateWsChannel)(dataProvider.fetch, collectionUrl).then((ws)=>{
            webSocketRef.current = ws; // Keep a ref to the webSocket so that it can be used elsewhere
            webSocketRef.current.addEventListener('message', (e)=>{
                const data = JSON.parse(e.data);
                if (data.type === 'Add') addItem(data.object, true);
                else if (data.type === 'Remove') removeItem(data.object, true);
            });
            webSocketRef.current.addEventListener('error', (e)=>{
                setHasLiveUpdates({
                    status: 'error',
                    error: e
                });
            // TODO: Retry after a while
            });
            webSocketRef.current.addEventListener('close', (e)=>{
                if (!hasLiveUpdates.error) setHasLiveUpdates({
                    ...hasLiveUpdates,
                    status: 'closed'
                });
            });
            setHasLiveUpdates({
                status: 'connected'
            });
        }).catch(()=>{}); // If it fails, we won't receive live updates. But that's okay.
    }, [
        collectionUrl,
        liveUpdates,
        dataProvider,
        webSocketRef,
        addItem,
        removeItem,
        setHasLiveUpdates
    ]);
    const awaitWebSocketConnection = (0, $85cNH$useCallback)((options = {})=>{
        const { timeout: timeout = 30000 } = options;
        if (!liveUpdates) throw new Error(`Cannot call awaitWebSocketConnection because the liveUpdates option is set to false`);
        return new Promise((resolve, reject)=>{
            if (webSocketRef?.current) resolve(webSocketRef);
            else {
                const timeoutId = setTimeout(()=>{
                    reject(`No WebSocket connection found within ${Math.round(timeout / 1000)}s`);
                }, timeout);
                const intervalId = setInterval(()=>{
                    if (webSocketRef?.current) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        resolve(webSocketRef);
                    } else console.log('WebSocket is not initialized yet, waiting...');
                }, 100);
            }
        });
    }, [
        webSocketRef,
        liveUpdates
    ]);
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
    if (yieldsTotalItems || !isPaginated) return {
        ...returnObject,
        totalItems: totalItems
    };
    return returnObject;
};
var $8281f3ce3b9d6123$export$2e2bcd8739ae039 = $8281f3ce3b9d6123$var$useCollection;




/**
 * Hook used internally by useInbox and useOutbox. This is not exported.
 * @param awaitWebSocketConnection Promise returning the WebSocket which allow to listen to the inbox or outbox
 * @param existingActivities Partial list of activities already received in the inbox and outbox
 */ const $600ca419166a1ded$var$useAwaitActivity = (awaitWebSocketConnection, existingActivities)=>{
    const dataProvider = (0, $85cNH$useDataProvider)();
    // TODO Allow to pass an  object, and automatically dereference it if required, like on the @semapps/activitypub matchActivity util
    return (0, $85cNH$useCallback)((matchActivity, options = {})=>{
        const { timeout: timeout = 30000, checkExistingActivities: checkExistingActivities = false } = options;
        return new Promise((resolve, reject)=>{
            awaitWebSocketConnection().then((webSocketRef)=>{
                const onMessage = (event)=>{
                    const data = JSON.parse(event.data);
                    if (data.type === 'Add') dataProvider.fetch(data.object).then(({ json: json })=>{
                        if (matchActivity(json)) {
                            removeListeners();
                            return resolve(json);
                        }
                    });
                };
                const onError = (e)=>{
                    // TODO reconnect if connection closed
                    removeListeners();
                    reject(e);
                };
                const onClose = (e)=>{
                    removeListeners();
                    reject(new Error(`${e.reason} (Code: ${e.code})`));
                };
                const removeListeners = ()=>{
                    webSocketRef.current?.removeEventListener('message', onMessage);
                    webSocketRef.current?.removeEventListener('error', onError);
                    webSocketRef.current?.removeEventListener('close', onClose);
                };
                webSocketRef.current?.addEventListener('message', onMessage);
                webSocketRef.current?.addEventListener('error', onError);
                webSocketRef.current?.addEventListener('close', onClose);
                // If a list of activities is already loaded, verify if there is a match
                if (existingActivities && checkExistingActivities) for (const a of existingActivities){
                    if (typeof a !== 'string') {
                        if (matchActivity(a)) {
                            removeListeners();
                            return resolve(a);
                        }
                    }
                }
                setTimeout(()=>{
                    removeListeners();
                    reject(new Error('Timeout'));
                }, timeout);
            }).catch((e)=>{
                reject(e);
            });
        });
    }, [
        awaitWebSocketConnection,
        existingActivities,
        dataProvider
    ]);
};
var $600ca419166a1ded$export$2e2bcd8739ae039 = $600ca419166a1ded$var$useAwaitActivity;


/**
 * Hook to fetch and post to the outbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `post`: a function to post a new activity in the user's outbox
 * - `awaitActivity`: a function to wait for a certain activity to be posted
 * - `owner`: the WebID of the outbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useoutbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $4d1d40fdbcd30589$var$useOutbox = (options = {})=>{
    const dataProvider = (0, $85cNH$useDataProvider)();
    const { data: identity } = (0, $85cNH$useGetIdentity)();
    const { url: url, items: items, awaitWebSocketConnection: awaitWebSocketConnection, ...rest } = (0, $8281f3ce3b9d6123$export$2e2bcd8739ae039)('outbox', options);
    const awaitActivity = (0, $600ca419166a1ded$export$2e2bcd8739ae039)(awaitWebSocketConnection, items);
    // Post an activity to the logged user's outbox and return its URI
    const post = (0, $85cNH$useCallback)(async (activity)=>{
        if (!url) throw new Error('Cannot post to outbox before user identity is loaded. Please use the isLoading argument of useOutbox');
        const { headers: headers } = await dataProvider.fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                '@context': 'https://www.w3.org/ns/activitystreams',
                ...activity
            })
        });
        return headers.get('Location');
    }, [
        url,
        dataProvider
    ]);
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
var $4d1d40fdbcd30589$export$2e2bcd8739ae039 = $4d1d40fdbcd30589$var$useOutbox;




// Fix a bug in the current version of the mention extension
// (The { id, label } object is located inside the id property)
// See https://github.com/ueberdosis/tiptap/pull/1322
const $40f4c00d51a137ec$var$CustomMention = (0, $85cNH$tiptapextensionmention).extend({
    renderHTML ({ node: node, HTMLAttributes: HTMLAttributes }) {
        return [
            'span',
            (0, $85cNH$mergeAttributes)(this.options.HTMLAttributes, HTMLAttributes),
            `@${node.attrs.id.label}`
        ];
    },
    addAttributes () {
        return {
            label: {
                default: null,
                parseHTML: (element)=>{
                    return {
                        label: element.getAttribute('data-mention-label')
                    };
                },
                renderHTML: (attributes)=>{
                    if (!attributes.id.label) return {};
                    return {
                        'data-mention-label': attributes.id.label
                    };
                }
            },
            id: {
                default: null,
                parseHTML: (element)=>{
                    return {
                        id: element.getAttribute('data-mention-id')
                    };
                },
                renderHTML: (attributes)=>{
                    if (!attributes.id.id) return {};
                    return {
                        'data-mention-id': attributes.id.id
                    };
                }
            }
        };
    }
});
var $40f4c00d51a137ec$export$2e2bcd8739ae039 = $40f4c00d51a137ec$var$CustomMention;


const $3047004939eff50c$var$useStyles = (0, $85cNH$makeStyles)((theme)=>({
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
const $3047004939eff50c$var$EmptyToolbar = ()=>null;
const $3047004939eff50c$var$PostCommentForm = ({ context: context, placeholder: placeholder, helperText: helperText, mentions: mentions, userResource: userResource, addItem: addItem, removeItem: removeItem })=>{
    const record = (0, $85cNH$useRecordContext)();
    const { data: identity, isLoading: isLoading } = (0, $85cNH$useGetIdentity)();
    const userDataModel = (0, $85cNH$useDataModel)(userResource);
    const classes = $3047004939eff50c$var$useStyles();
    const notify = (0, $85cNH$useNotify)();
    const outbox = (0, $4d1d40fdbcd30589$export$2e2bcd8739ae039)();
    const [expanded, setExpanded] = (0, $85cNH$useState)(false);
    const [openAuth, setOpenAuth] = (0, $85cNH$useState)(false);
    const onSubmit = (0, $85cNH$useCallback)(async (values)=>{
        const document = new DOMParser().parseFromString(values.comment, 'text/html');
        const mentions = Array.from(document.body.getElementsByClassName('mention'));
        const mentionedUsersUris = [];
        mentions.forEach((node)=>{
            // @ts-expect-error TS(7015): Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            const userUri = node.attributes['data-mention-id'].value;
            // @ts-expect-error TS(7015): Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            const userLabel = node.attributes['data-mention-label'].value;
            const link = document.createElement('a');
            link.setAttribute('href', `${new URL(window.location.href).origin}/${userResource}/${encodeURIComponent(userUri)}/show`);
            link.textContent = `@${userLabel}`;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            node.parentNode.replaceChild(link, node);
            mentionedUsersUris.push(userUri);
        });
        if (document.body.innerHTML === 'undefined') notify('Votre commentaire est vide', {
            type: 'error'
        });
        else {
            const tempId = Date.now();
            const note = {
                type: (0, $cb5f912aee8137fc$export$c49cfb2681596b20).NOTE,
                attributedTo: outbox.owner,
                content: document.body.innerHTML,
                inReplyTo: record?.[context],
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
                    to: [
                        ...mentionedUsersUris,
                        (0, $cb5f912aee8137fc$export$4d8d554031975581)
                    ]
                });
                notify("Commentaire post\xe9 avec succ\xe8s", {
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
    }, [
        outbox,
        notify,
        setExpanded,
        addItem,
        removeItem
    ]);
    const openAuthIfDisconnected = (0, $85cNH$useCallback)(()=>{
        if (!identity?.id) setOpenAuth(true);
    }, [
        identity,
        setOpenAuth
    ]);
    // Don't init the editor options until mentions and identity are loaded, as they can only be initialized once
    if (mentions && !mentions.items || isLoading) return null;
    return /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Fragment), {
        children: [
            /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Form), {
                onSubmit: onSubmit,
                className: classes.form,
                children: /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Box), {
                    className: classes.container,
                    onClick: openAuthIfDisconnected,
                    children: [
                        /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Avatar), {
                            src: // @ts-expect-error TS(2339): Property 'image' does not exist on type '{ title: ... Remove this comment to see the full error message
                            identity?.webIdData?.[userDataModel?.fieldsMapping?.image] || // @ts-expect-error TS(2339): Property 'image' does not exist on type '{ title: ... Remove this comment to see the full error message
                            identity?.profileData?.[userDataModel?.fieldsMapping?.image],
                            className: classes.avatar
                        }),
                        /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$RichTextInput), {
                            source: "comment",
                            label: " ",
                            toolbar: /*#__PURE__*/ (0, $85cNH$jsx)($3047004939eff50c$var$EmptyToolbar, {}),
                            fullWidth: true,
                            classes: {
                                editorContent: classes.editorContent
                            },
                            editorOptions: {
                                ...(0, $85cNH$DefaultEditorOptions),
                                onFocus () {
                                    setExpanded(true);
                                },
                                extensions: [
                                    // @ts-expect-error TS(2461): Type 'Extensions | undefined' is not an array type... Remove this comment to see the full error message
                                    ...(0, $85cNH$DefaultEditorOptions).extensions,
                                    placeholder ? (0, $85cNH$tiptapextensionplaceholder).configure({
                                        placeholder: placeholder
                                    }) : null,
                                    mentions ? (0, $40f4c00d51a137ec$export$2e2bcd8739ae039).configure({
                                        HTMLAttributes: {
                                            class: 'mention'
                                        },
                                        suggestion: mentions
                                    }) : null
                                ],
                                // Disable editor if user is not connected
                                editable: !!identity?.id
                            },
                            helperText: helperText
                        }),
                        expanded && /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Button), {
                            type: "submit",
                            size: "small",
                            variant: "contained",
                            color: "primary",
                            endIcon: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$muiiconsmaterialSend), {}),
                            className: classes.button,
                            children: "Envoyer"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$AuthDialog), {
                open: openAuth,
                onClose: ()=>setOpenAuth(false),
                message: "Pour poster un commentaire, vous devez \xeatre connect\xe9."
            })
        ]
    });
};
var $3047004939eff50c$export$2e2bcd8739ae039 = $3047004939eff50c$var$PostCommentForm;








const $74ea3002402ef672$var$useStyles = (0, $85cNH$makeStyles)(()=>({
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
const $74ea3002402ef672$var$CommentsList = ({ comments: comments, userResource: userResource, loading: loading })=>{
    const classes = $74ea3002402ef672$var$useStyles();
    const userDataModel = (0, $85cNH$useDataModel)(userResource);
    return /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Box), {
        position: "relative",
        children: [
            comments && comments.sort((a, b)=>new Date(b.published).getTime() - new Date(a.published).getTime()).map((comment)=>/*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Box), {
                    className: classes.container,
                    children: [
                        /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Box), {
                            className: classes.avatar,
                            children: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$ReferenceField), {
                                record: comment,
                                reference: userResource,
                                source: "attributedTo",
                                linkType: "show",
                                children: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$AvatarWithLabelField), {
                                    image: userDataModel?.fieldsMapping?.image
                                })
                            })
                        }),
                        /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Box), {
                            className: classes.text,
                            children: [
                                /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Typography), {
                                    variant: "body2",
                                    children: [
                                        /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$ReferenceField), {
                                            record: comment,
                                            reference: userResource,
                                            source: "attributedTo",
                                            linkType: "show",
                                            children: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$TextField), {
                                                variant: "body2",
                                                source: userDataModel?.fieldsMapping?.title || '',
                                                className: classes.label
                                            })
                                        }),
                                        "\xa0\u2022\xa0",
                                        /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$DateField), {
                                            record: comment,
                                            variant: "body2",
                                            source: "published",
                                            showTime: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$RichTextField), {
                                    record: comment,
                                    variant: "body1",
                                    source: "content",
                                    className: classes.content
                                })
                            ]
                        })
                    ]
                }, comment.id)),
            loading && /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Box), {
                minHeight: 200,
                children: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$Box), {
                    alignItems: "center",
                    className: classes.loading,
                    children: /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$CircularProgress), {
                        size: 60,
                        thickness: 6
                    })
                })
            })
        ]
    });
};
var $74ea3002402ef672$export$2e2bcd8739ae039 = $74ea3002402ef672$var$CommentsList;



const $a8ae38fbe2f0ecc5$var$CommentsField = ({ source: source = 'id', context: context = 'id', helperText: helperText, placeholder: placeholder = "Commencez \xe0 taper votre commentaire...", userResource: userResource, mentions: mentions })=>{
    const record = (0, $85cNH$useRecordContext)();
    const { items: comments, isLoading: isLoading, addItem: addItem, removeItem: removeItem } = (0, $8281f3ce3b9d6123$export$2e2bcd8739ae039)(record?.replies, {
        liveUpdates: true
    });
    if (!userResource) throw new Error('No userResource defined for CommentsField');
    return /*#__PURE__*/ (0, $85cNH$jsxs)((0, $85cNH$Fragment), {
        children: [
            /*#__PURE__*/ (0, $85cNH$jsx)((0, $3047004939eff50c$export$2e2bcd8739ae039), {
                context: context,
                helperText: helperText,
                userResource: userResource,
                placeholder: placeholder,
                mentions: mentions,
                addItem: addItem,
                removeItem: removeItem
            }),
            /*#__PURE__*/ (0, $85cNH$jsx)((0, $74ea3002402ef672$export$2e2bcd8739ae039), {
                comments: comments,
                loading: isLoading,
                userResource: userResource
            })
        ]
    });
};
var $a8ae38fbe2f0ecc5$export$2e2bcd8739ae039 = $a8ae38fbe2f0ecc5$var$CommentsField;






const $f2bfc37210e303cc$var$CollectionList = ({ collectionUrl: collectionUrl, resource: resource, children: children })=>{
    if ((0, $85cNH$react).Children.count(children) !== 1) throw new Error('<CollectionList> only accepts a single child');
    const { items: actorsUris } = (0, $8281f3ce3b9d6123$export$2e2bcd8739ae039)(collectionUrl);
    const { data: data, isLoading: isLoading, isFetching: isFetching } = (0, $85cNH$useGetMany)(resource, {
        ids: Array.isArray(actorsUris) ? actorsUris : [
            actorsUris
        ]
    }, {
        enabled: !!actorsUris
    });
    const listContext = (0, $85cNH$useList)({
        data: data,
        isLoading: isLoading,
        isFetching: isFetching
    });
    return /*#__PURE__*/ (0, $85cNH$jsx)((0, $85cNH$ListContextProvider), {
        value: listContext,
        children: children
    });
};
var $f2bfc37210e303cc$export$2e2bcd8739ae039 = $f2bfc37210e303cc$var$CollectionList;






const $4d1eaed181ef6aa8$var$ReferenceCollectionField = ({ source: source, reference: reference, children: children, ...rest })=>{
    const record = (0, $85cNH$useRecordContext)();
    if ((0, $85cNH$react).Children.count(children) !== 1) throw new Error('<ReferenceCollectionField> only accepts a single child');
    if (!record || !record[source]) return null;
    return /*#__PURE__*/ (0, $85cNH$jsx)((0, $f2bfc37210e303cc$export$2e2bcd8739ae039), {
        resource: reference,
        collectionUrl: record[source],
        ...rest,
        children: children
    });
};
var $4d1eaed181ef6aa8$export$2e2bcd8739ae039 = $4d1eaed181ef6aa8$var$ReferenceCollectionField;













/**
 * Subscribe to a collection. Supports pagination.
 * @param collectionUri The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions & UseTypedCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false, pageSize: 10 }` and requires at least one ldo @see {ShapeType}.
 */ const $75609b4dfb738328$var$useTypedCollection = (collectionUri, options)=>{
    const { pageSize: pageSize = 10, liveUpdates: subscribeToUpdates = false, shapeTypes: shapeTypes } = options;
    if (!shapeTypes.length) throw new Error('At least one ShapeType is required to filter the collection by.');
    // 1. Fetch the collection
    const collectionQuery = $75609b4dfb738328$var$useInfiniteCollectionQuery(collectionUri);
    const { totalItems: totalItems, isPaginated: isPaginated } = $75609b4dfb738328$var$useTotalItemsFromPages(collectionQuery.data);
    // 2. Filter items from the collection pages that match the given shape types.
    const filteredItems = $75609b4dfb738328$var$useFilteredItemsFromPages(collectionQuery.data, shapeTypes);
    // 3. Set up notifications for live updates, if enabled.
    const liveUpdatesStatus = $75609b4dfb738328$var$useSubscribeToUpdates({
        uri: collectionUri,
        enabled: subscribeToUpdates,
        onAddItem: (_item)=>{
            // Since we don't know where the item was added, we refetch the whole collection ¯\_(ツ)_/¯.
            collectionQuery.refetch();
        },
        onRemoveItem: (uri)=>{
            $75609b4dfb738328$var$removeItemFromQueryData(uri, collectionQuery);
        }
    });
    // 4. Pagination logic.
    const [requestedNextItems, setRequestedNextItems] = (0, $85cNH$useState)(pageSize);
    const [requestedPrevItems, setRequestedPrevItems] = (0, $85cNH$useState)(0);
    // Automatically fetch next page, if more items are requested.
    (0, $85cNH$useEffect)(()=>{
        if (requestedNextItems > filteredItems.length && collectionQuery.hasNextPage && !collectionQuery.isLoading) collectionQuery.fetchNextPage();
    }, [
        requestedNextItems,
        filteredItems.length,
        collectionQuery.hasNextPage,
        collectionQuery.isLoading
    ]);
    // Automatically fetch previous page, if more items are requested.
    (0, $85cNH$useEffect)(()=>{
        if (requestedPrevItems > filteredItems.length && collectionQuery.hasPreviousPage && !collectionQuery.isLoading) collectionQuery.fetchPreviousPage();
    }, [
        requestedPrevItems,
        filteredItems.length,
        collectionQuery.hasPreviousPage,
        collectionQuery.isLoading
    ]);
    /** Fetch next n (filtered) items. */ const fetchNext = (0, $85cNH$useCallback)((noItems = pageSize)=>{
        setRequestedNextItems(filteredItems.length + noItems);
    }, [
        filteredItems.length,
        pageSize
    ]);
    /** Fetch previous n (filtered) items. */ const fetchPrevious = (0, $85cNH$useCallback)((noItems = pageSize)=>{
        setRequestedPrevItems(filteredItems.length + noItems);
    }, [
        filteredItems.length,
        pageSize
    ]);
    return {
        // TODO: Do we want to expose all properties from the collection query?
        ...collectionQuery,
        items: filteredItems,
        liveUpdatesStatus: liveUpdatesStatus,
        fetchNext: fetchNext,
        fetchPrevious: fetchPrevious,
        totalItems: totalItems,
        isPaginated: isPaginated
    };
};
var $75609b4dfb738328$export$2e2bcd8739ae039 = $75609b4dfb738328$var$useTypedCollection;
const $75609b4dfb738328$var$useSubscribeToUpdates = ({ uri: uri, enabled: enabled = true, onAddItem: onAddItem, onRemoveItem: onRemoveItem })=>{
    const { fetch: fetchFn } = (0, $85cNH$useDataProvider)();
    const [status, setStatus] = (0, $85cNH$useState)({
        status: enabled ? 'connecting' : 'disabled'
    });
    (0, $85cNH$useEffect)(()=>{
        const webSocketRef = (0, $85cNH$useRef)(null);
        // Nothing to do, return empty clean up function.
        if (!enabled || !uri) return ()=>{};
        // Create ws that listens to collectionUri changes
        (0, $85cNH$getOrCreateWsChannel)(fetchFn, uri).then((ws)=>{
            webSocketRef.current = ws; // Keep a ref to the webSocket so that it can be used elsewhere
            webSocketRef.current.addEventListener('message', (event)=>{
                // TODO: correct ldo type
                const data = JSON.parse(event.data);
                if (data.type === 'Add') onAddItem(data.object);
                else if (data.type === 'Remove') onRemoveItem(data.object);
            });
            webSocketRef.current.addEventListener('error', (event)=>{
                setStatus({
                    error: event,
                    status: 'error'
                });
            // TODO: Retry after a while (use react query?).
            });
            webSocketRef.current.addEventListener('close', (_event)=>{
                if (!status.error) setStatus({
                    status: 'closed'
                });
            });
        }).catch((error)=>{
            setStatus({
                status: 'error',
                error: error
            });
        });
        // Clean up, i.e. close channel.
        return ()=>{
            webSocketRef.current?.close();
        };
    }, [
        uri,
        enabled,
        onAddItem,
        onRemoveItem
    ]);
    return status;
};
const $75609b4dfb738328$var$useInfiniteCollectionQuery = (collectionUri)=>{
    const { data: identity } = (0, $85cNH$useGetIdentity)();
    const dataProvider = (0, $85cNH$useDataProvider)();
    const { fetch: fetchFn } = dataProvider;
    const infiniteQueryData = (0, $85cNH$useInfiniteQuery)({
        queryKey: [
            'collection',
            {
                uri: collectionUri
            }
        ],
        queryFn: $75609b4dfb738328$var$getFetchCollectionPage(fetchFn),
        initialPageParam: collectionUri,
        enabled: !!(collectionUri && identity?.id),
        getNextPageParam: (current)=>current.data?.next,
        getPreviousPageParam: (current)=>current.data?.prev
    });
    return infiniteQueryData;
};
const $75609b4dfb738328$var$getFetchCollectionPage = (fetchFn)=>async ({ pageParam: pageUri })=>{
        // Note, page is not necessarily of type OrderedCollectionPage but it is a partial in any case.
        const jsonPage = await (await fetchFn(pageUri)).json();
        if (!jsonPage || typeof jsonPage !== 'object') throw new Error(`Could not fetch page ${pageUri}. Response is invalid.`);
        const itemsKey = 'orderedItems' in jsonPage ? 'orderedItems' : 'items';
        if ((0, $577f4953dfa5de4f$export$e57ff0f701c44363)(jsonPage[itemsKey]).length === 0) // No items in page.
        return {
            itemIds: [],
            dataset: null,
            data: null
        };
        // Keep track of item ids in this order (in the rdf dataset the order is lost).
        const itemIds = (0, $577f4953dfa5de4f$export$e57ff0f701c44363)(jsonPage[itemsKey]).map((itemOrId)=>itemOrId?.['@id'] || itemOrId?.id || itemOrId).filter((item)=>item); // Ensure item is not undefined.
        // Parse the page into a dataset.
        // TODO: Move to data provider.
        const dataset = (0, $85cNH$createConnectedLdoDataset)([
            (0, $85cNH$solidConnectedPlugin)
        ]);
        dataset.setContext('solid', {
            fetch: fetchFn
        });
        dataset.addAll(await (0, $577f4953dfa5de4f$export$7089f01fea2fc5c2)(jsonPage));
        const resource = dataset.getResource(pageUri);
        if (resource.type === 'InvalidIdentifierResource') return {
            itemIds: itemIds,
            dataset: null,
            pageUri: pageUri,
            data: null
        };
        const ldoBuilder = dataset.usingType((0, $85cNH$OrderedCollectionPageShapeType));
        // Run a link query to ensure that all items are dereferenced (the results are kept in the dataset).
        await ldoBuilder.startLinkQuery(resource, pageUri, {
            items: true,
            orderedItems: true
        }).run({
            reload: false
        });
        return {
            dataset: dataset,
            itemIds: itemIds,
            pageUri: pageUri,
            data: ldoBuilder.fromSubject(pageUri)
        };
    };
const $75609b4dfb738328$var$useTotalItemsFromPages = (queryData)=>{
    if (!queryData?.pages.length) return {
        isPaginated: undefined,
        totalItems: undefined
    };
    const { pages: pages } = queryData;
    // Check if collection is paginated. We assume that the collection is paginated if there are pages with first, last, prev or next.
    const isPaginated = pages.length === 0 ? undefined : !!pages.find((page)=>page.data && ('first' in page.data || 'next' in page.data || 'last' in page.data || 'prev' in page.data));
    // Approach 1: Get total items info by checking if the page has a totalItems property.
    const totalItemsByCollectionInfo = pages.find((page)=>'totalItems' in page)?.data?.totalItems;
    if (totalItemsByCollectionInfo) return {
        totalItems: totalItemsByCollectionInfo,
        isPaginated: isPaginated
    };
    // Approach 2: If collection is not paginated, we count the number of items in the collection.
    if (!isPaginated) return {
        totalItems: pages[0].itemIds.length,
        isPaginated: isPaginated
    };
    // Approach 3: If we have the whole collection loaded, we can count the items.
    const firstPage = pages.find((page)=>page.data?.first)?.data?.first;
    const lastPage = pages.find((page)=>page.data?.last)?.data?.last;
    // We assume that all pages are loaded if the first and last page is available.
    // In that case, count all pages' items.
    if (firstPage && lastPage) return {
        isPaginated: isPaginated,
        totalItems: pages// Get length of page
        .map((page)=>page.data?.orderedItems?.size || page.data?.items?.size || 0)// Sum all page length counts.
        .reduce((prev, current)=>prev + current)
    };
    // If no approach succeeded, we return undefined.
    return {
        totalItems: undefined,
        isPaginated: isPaginated
    };
};
const $75609b4dfb738328$var$useFilteredItemsFromPages = (queryData, shapeTypes)=>{
    const [filteredItems, setFilteredItems] = (0, $85cNH$useState)([]);
    const filterItems = (0, $85cNH$useCallback)(async ()=>{
        // We need to load the shacl resources and match them to the shape types.
        const validator = await (0, $25cb6caf33e2f460$export$8b707c2a07270e94)();
        const pages = queryData?.pages;
        if (!pages || pages.length === 0) {
            setFilteredItems([]);
            return;
        }
        const validatedItems = await Promise.all(// For every page, ...
        queryData.pages.map(async (page)=>{
            const items = await Promise.all(// For every item in the page, ...
            page.itemIds.map(async (itemId)=>// Validate item against the shape types and return the ldo object of the correct type, if it is valid.
                page.dataset && (0, $25cb6caf33e2f460$export$c4cb1062f0ffb837)(itemId, page.dataset, shapeTypes, validator))).then((results)=>results.filter((item)=>!!item)); // Filter out null items.
            return items;
        })).then((results)=>results.flat());
        // TODO: Order items by ids.
        setFilteredItems(validatedItems);
    // TODO: Cache filtered items by page, so that we don't have to re-filter them every time?
    }, [
        queryData?.pages,
        shapeTypes
    ]);
    (0, $85cNH$useEffect)(()=>{
        filterItems();
    }, [
        filterItems
    ]);
    return filteredItems;
};
/** A somewhat hacky way to remove an item from the useInfiniteCollectionQuery. */ const $75609b4dfb738328$var$removeItemFromQueryData = (itemUri, collectionQuery)=>{
    // Manipulate data about total items. Sorry, a bit hacky...
    collectionQuery.data?.pages.forEach((page)=>{
        if (!page.dataset) return;
        page.dataset.deleteMatches((0, $85cNH$rdfext).namedNode(itemUri));
        // There might be a totalItems property in the page, so we need to update it.
        if (page.data.totalItems && Number.isInteger(page.data.totalItems)) // eslint-disable-next-line no-param-reassign
        page.data.totalItems -= 1;
    });
}; // Open Question:
 // - Use one dataset? It has the benefit of only having to define a single solid connected dataset and makes ng switching easier -> no need to create a connected dataset.
 // - On the other hand (the only downside I can think of rn): Either you have to remove expired items from the dataset or you don't care about old data that is not used by react admin anymore. At a refetch all old data would have to be removed though.





/**
 * Hook to fetch the inbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `awaitActivity`: a function to wait for a certain activity to be received
 * - `owner`: the WebID of the inbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useinbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */ const $cc1d1cd0e97c63a2$var$useInbox = (options = {})=>{
    const { data: identity } = (0, $85cNH$useGetIdentity)();
    const { url: url, items: items, awaitWebSocketConnection: awaitWebSocketConnection, ...rest } = (0, $8281f3ce3b9d6123$export$2e2bcd8739ae039)('inbox', options);
    const awaitActivity = (0, $600ca419166a1ded$export$2e2bcd8739ae039)(awaitWebSocketConnection, items);
    return {
        url: url,
        items: items,
        awaitWebSocketConnection: awaitWebSocketConnection,
        awaitActivity: awaitActivity,
        owner: identity?.id,
        ...rest
    };
};
var $cc1d1cd0e97c63a2$export$2e2bcd8739ae039 = $cc1d1cd0e97c63a2$var$useInbox;




const $6a227ddc2fd92a7a$var$useNodeinfo = (host, rel = 'http://nodeinfo.diaspora.software/ns/schema/2.1')=>{
    const [schema, setSchema] = (0, $85cNH$useState)();
    (0, $85cNH$useEffect)(()=>{
        (async ()=>{
            if (host && rel) {
                const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are likely on HTTP
                const nodeinfoUrl = `${protocol}://${host}/.well-known/nodeinfo`;
                try {
                    const { json: links } = await (0, $85cNH$fetchUtils).fetchJson(nodeinfoUrl);
                    // Accept any version of the nodeinfo protocol
                    const link = links?.links?.find((l)=>l.rel === rel);
                    if (link) {
                        const { json: json } = await (0, $85cNH$fetchUtils).fetchJson(link.href);
                        setSchema(json);
                    }
                } catch (e) {
                // Do nothing if nodeinfo can't be fetched
                }
            }
        })();
    }, [
        host,
        setSchema,
        rel
    ]);
    return schema;
};
var $6a227ddc2fd92a7a$export$2e2bcd8739ae039 = $6a227ddc2fd92a7a$var$useNodeinfo;





const $d33ef82068985aa5$var$useWebfinger = ()=>{
    // Post an activity to the logged user's outbox and return its URI
    const fetch = (0, $85cNH$useCallback)(async (id)=>{
        // eslint-disable-next-line
        const [_, username, host] = id.split('@');
        if (host) {
            const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are most likely on localhost
            const webfingerUrl = `${protocol}://${host}/.well-known/webfinger?resource=acct:${username}@${host}`;
            try {
                const { json: json } = await (0, $85cNH$fetchUtils).fetchJson(webfingerUrl);
                const link = json.links.find((l)=>l.type === 'application/activity+json');
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
var $d33ef82068985aa5$export$2e2bcd8739ae039 = $d33ef82068985aa5$var$useWebfinger;










const $2d6cf763aa4118ce$var$useStyles = (0, $85cNH$makeStyles)((theme)=>({
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
var $2d6cf763aa4118ce$export$2e2bcd8739ae039 = /*#__PURE__*/ (0, $85cNH$forwardRef)((props, ref)=>{
    const [selectedIndex, setSelectedIndex] = (0, $85cNH$useState)(0);
    const classes = $2d6cf763aa4118ce$var$useStyles();
    const selectItem = (index)=>{
        // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
        const item = props.items[index];
        if (item) // @ts-expect-error TS(2339): Property 'command' does not exist on type '{}'.
        props.command({
            id: item
        });
    };
    const upHandler = ()=>{
        // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };
    const downHandler = ()=>{
        // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };
    const enterHandler = ()=>{
        selectItem(selectedIndex);
    };
    // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
    (0, $85cNH$useEffect)(()=>setSelectedIndex(0), [
        props.items
    ]);
    (0, $85cNH$useImperativeHandle)(ref, ()=>({
            onKeyDown: ({ event: event })=>{
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
    return /*#__PURE__*/ (0, $85cNH$jsx)("div", {
        className: classes.items,
        children: props.items.length ? // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
        props.items.map((item, index)=>/*#__PURE__*/ (0, $85cNH$jsx)("button", {
                className: classes.item + (index === selectedIndex ? ' selected' : ''),
                onClick: ()=>selectItem(index),
                children: item.label
            }, index)) : /*#__PURE__*/ (0, $85cNH$jsx)("div", {
            className: classes.item,
            children: "Aucun r\xe9sultat"
        })
    });
});


const $81b58d0f1db1e46b$var$renderMentions = ()=>{
    let component;
    let popup;
    return {
        onStart: (props)=>{
            component = new (0, $85cNH$ReactRenderer)((0, $2d6cf763aa4118ce$export$2e2bcd8739ae039), {
                props: props,
                editor: props.editor
            });
            popup = (0, $85cNH$tippyjs)('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: ()=>document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start'
            });
        },
        onUpdate (props) {
            component.updateProps(props);
            popup[0].setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onKeyDown (props) {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }
            return component.ref?.onKeyDown(props);
        },
        onExit () {
            popup[0].destroy();
            component.destroy();
        }
    };
};
var $81b58d0f1db1e46b$export$2e2bcd8739ae039 = $81b58d0f1db1e46b$var$renderMentions;


const $2444c190214b72ec$var$useMentions = (userResource)=>{
    const userDataModel = (0, $85cNH$useDataModel)(userResource);
    const { data: data } = (0, $85cNH$useGetList)(userResource, {
        filter: {
            _predicates: [
                userDataModel?.fieldsMapping?.title
            ],
            blankNodes: []
        }
    }, {
        enabled: !!userDataModel?.fieldsMapping?.title
    });
    const availableMentions = (0, $85cNH$useMemo)(()=>{
        if (data) return data.map((item)=>({
                id: item.id,
                label: item[userDataModel?.fieldsMapping?.title || '']
            }));
    }, [
        data
    ]);
    const items = (0, $85cNH$useMemo)(()=>{
        if (availableMentions) return ({ query: query })=>{
            return availableMentions.filter(({ label: label })=>label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
        };
    }, [
        availableMentions
    ]);
    return {
        items: items,
        render: (0, $81b58d0f1db1e46b$export$2e2bcd8739ae039)
    };
};
var $2444c190214b72ec$export$2e2bcd8739ae039 = $2444c190214b72ec$var$useMentions;





export {$a8ae38fbe2f0ecc5$export$2e2bcd8739ae039 as CommentsField, $f2bfc37210e303cc$export$2e2bcd8739ae039 as CollectionList, $4d1eaed181ef6aa8$export$2e2bcd8739ae039 as ReferenceCollectionField, $8281f3ce3b9d6123$export$2e2bcd8739ae039 as useCollection, $75609b4dfb738328$export$2e2bcd8739ae039 as useTypedCollection, $cc1d1cd0e97c63a2$export$2e2bcd8739ae039 as useInbox, $6a227ddc2fd92a7a$export$2e2bcd8739ae039 as useNodeinfo, $4d1d40fdbcd30589$export$2e2bcd8739ae039 as useOutbox, $d33ef82068985aa5$export$2e2bcd8739ae039 as useWebfinger, $2444c190214b72ec$export$2e2bcd8739ae039 as useMentions, $cb5f912aee8137fc$export$1ec8e53e7d982d22 as ACTIVITY_TYPES, $cb5f912aee8137fc$export$9649665d7ccb0dc2 as ACTOR_TYPES, $cb5f912aee8137fc$export$c49cfb2681596b20 as OBJECT_TYPES, $cb5f912aee8137fc$export$4d8d554031975581 as PUBLIC_URI};
//# sourceMappingURL=index.es.js.map
