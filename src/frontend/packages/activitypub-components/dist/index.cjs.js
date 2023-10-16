var $jwOeV$reactjsxruntime = require("react/jsx-runtime");
var $jwOeV$react = require("react");
var $jwOeV$reactadmin = require("react-admin");
var $jwOeV$rainputrichtext = require("ra-input-rich-text");
var $jwOeV$tiptapextensionplaceholder = require("@tiptap/extension-placeholder");
var $jwOeV$muimaterial = require("@mui/material");
var $jwOeV$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $jwOeV$muiiconsmaterialSend = require("@mui/icons-material/Send");
var $jwOeV$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $jwOeV$semappsauthprovider = require("@semapps/auth-provider");
var $jwOeV$tiptapcore = require("@tiptap/core");
var $jwOeV$tiptapextensionmention = require("@tiptap/extension-mention");
var $jwOeV$semappsfieldcomponents = require("@semapps/field-components");
var $jwOeV$tiptapreact = require("@tiptap/react");
var $jwOeV$tippyjs = require("tippy.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "CommentsField", () => $2e5504cc4159ca8d$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CollectionList", () => $505d598a33288aad$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceCollectionField", () => $b0c94a9bdea99da5$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCollection", () => $2b75a2f49c9ef165$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useInbox", () => $97664763db3c0a46$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useOutbox", () => $decfdd34cc00b80e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useWebfinger", () => $5b61553556e35016$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useMentions", () => $968ea07fb81eda0b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ACTIVITY_TYPES", () => $ebea823cebb2f44b$export$1ec8e53e7d982d22);
$parcel$export(module.exports, "ACTOR_TYPES", () => $ebea823cebb2f44b$export$9649665d7ccb0dc2);
$parcel$export(module.exports, "OBJECT_TYPES", () => $ebea823cebb2f44b$export$c49cfb2681596b20);
$parcel$export(module.exports, "PUBLIC_URI", () => $ebea823cebb2f44b$export$4d8d554031975581);
// Components













const $ebea823cebb2f44b$export$1ec8e53e7d982d22 = {
    ACCEPT: "Accept",
    ADD: "Add",
    ANNOUNCE: "Announce",
    ARRIVE: "Arrive",
    BLOCK: "Block",
    CREATE: "Create",
    DELETE: "Delete",
    DISLIKE: "Dislike",
    FLAG: "Flag",
    FOLLOW: "Follow",
    IGNORE: "Ignore",
    INVITE: "Invite",
    JOIN: "Join",
    LEAVE: "Leave",
    LIKE: "Like",
    LISTEN: "Listen",
    MOVE: "Move",
    OFFER: "Offer",
    QUESTION: "Question",
    REJECT: "Reject",
    READ: "Read",
    REMOVE: "Remove",
    TENTATIVE_REJECT: "TentativeReject",
    TENTATIVE_ACCEPT: "TentativeAccept",
    TRAVAL: "Travel",
    UNDO: "Undo",
    UPDATE: "Update",
    VIEW: "View"
};
const $ebea823cebb2f44b$export$9649665d7ccb0dc2 = {
    APPLICATION: "Application",
    GROUP: "Group",
    ORGANIZATION: "Organization",
    PERSON: "Person",
    SERVICE: "Service"
};
const $ebea823cebb2f44b$export$c49cfb2681596b20 = {
    ARTICLE: "Article",
    AUDIO: "Audio",
    DOCUMENT: "Document",
    EVENT: "Event",
    IMAGE: "Image",
    NOTE: "Note",
    PAGE: "Page",
    PLACE: "Place",
    PROFILE: "Profile",
    RELATIONSHIP: "Relationship",
    TOMBSTONE: "Tombstone",
    VIDEO: "Video"
};
const $ebea823cebb2f44b$export$4d8d554031975581 = "https://www.w3.org/ns/activitystreams#Public";





const $decfdd34cc00b80e$var$useOutbox = ()=>{
    const { identity: identity } = (0, $jwOeV$reactadmin.useGetIdentity)();
    const outboxUrl = (0, $jwOeV$react.useMemo)(()=>{
        if (identity?.webIdData) return identity?.webIdData?.outbox;
    }, [
        identity
    ]);
    const sparqlEndpoint = (0, $jwOeV$react.useMemo)(()=>{
        if (identity?.webIdData) return identity?.webIdData?.endpoints?.["void:sparqlEndpoint"] || `${identity?.id}/sparql`;
    }, [
        identity
    ]);
    // Post an activity to the logged user's outbox and return its URI
    const post = (0, $jwOeV$react.useCallback)(async (activity)=>{
        if (!outboxUrl) throw new Error("Cannot post to outbox before user identity is loaded. Please use the loaded argument of useOutbox");
        const token = localStorage.getItem("token");
        const { headers: headers } = await (0, $jwOeV$reactadmin.fetchUtils).fetchJson(outboxUrl, {
            method: "POST",
            body: JSON.stringify({
                "@context": "https://www.w3.org/ns/activitystreams",
                ...activity
            }),
            headers: new Headers({
                "Content-Type": "application/ld+json",
                Authorization: `Bearer ${token}`
            })
        });
        return headers.get("Location");
    }, [
        outboxUrl
    ]);
    const fetch = (0, $jwOeV$react.useCallback)(async ()=>{
        if (!sparqlEndpoint || !outboxUrl) return;
        const token = localStorage.getItem("token");
        const blankNodesQuery = (0, $jwOeV$semappssemanticdataprovider.buildBlankNodesQuery)([
            "as:object"
        ]);
        const query = `
      PREFIX as: <https://www.w3.org/ns/activitystreams#>
      CONSTRUCT {
        ?s1 ?p1 ?o1 .
        ${blankNodesQuery.construct}
      }
      WHERE {
        <${outboxUrl}> as:items ?s1 .
        ?s1 ?p1 ?o1 .
        ${blankNodesQuery.where}
      }
    `;
        const { json: json } = await (0, $jwOeV$reactadmin.fetchUtils).fetchJson(sparqlEndpoint, {
            method: "POST",
            body: query,
            headers: new Headers({
                Accept: "application/ld+json",
                Authorization: token ? `Bearer ${token}` : undefined
            })
        });
        if (json["@graph"]) return json["@graph"];
        return null;
    }, [
        sparqlEndpoint,
        outboxUrl
    ]);
    return {
        post: post,
        fetch: fetch,
        url: outboxUrl,
        loaded: !!outboxUrl,
        owner: identity?.id
    };
};
var $decfdd34cc00b80e$export$2e2bcd8739ae039 = $decfdd34cc00b80e$var$useOutbox;




// Fix a bug in the current version of the mention extension
// (The { id, label } object is located inside the id property)
// See https://github.com/ueberdosis/tiptap/pull/1322
const $9b1343b281972d72$var$CustomMention = (0, ($parcel$interopDefault($jwOeV$tiptapextensionmention))).extend({
    renderHTML ({ node: node, HTMLAttributes: HTMLAttributes }) {
        return [
            "span",
            (0, $jwOeV$tiptapcore.mergeAttributes)(this.options.HTMLAttributes, HTMLAttributes),
            `@${node.attrs.id.label}`
        ];
    },
    addAttributes () {
        return {
            label: {
                default: null,
                parseHTML: (element)=>{
                    return {
                        label: element.getAttribute("data-mention-label")
                    };
                },
                renderHTML: (attributes)=>{
                    if (!attributes.id.label) return {};
                    return {
                        "data-mention-label": attributes.id.label
                    };
                }
            },
            id: {
                default: null,
                parseHTML: (element)=>{
                    return {
                        id: element.getAttribute("data-mention-id")
                    };
                },
                renderHTML: (attributes)=>{
                    if (!attributes.id.id) return {};
                    return {
                        "data-mention-id": attributes.id.id
                    };
                }
            }
        };
    }
});
var $9b1343b281972d72$export$2e2bcd8739ae039 = $9b1343b281972d72$var$CustomMention;


const $703eba3e46be7ee5$var$useStyles = (0, ($parcel$interopDefault($jwOeV$muistylesmakeStyles)))((theme)=>({
        form: {
            marginTop: -12 // Negative margin to keep the form close to the label
        },
        container: {
            paddingLeft: 80,
            position: "relative"
        },
        avatar: {
            position: "absolute",
            top: 16,
            left: 0,
            bottom: 0,
            width: 64,
            height: 64
        },
        editorContent: {
            "& > div": {
                backgroundColor: "rgba(0, 0, 0, 0.09)",
                padding: "2px 12px",
                borderWidth: "0px !important",
                borderRadius: 0,
                borderBottom: "1px solid #FFF",
                minHeight: 60,
                outline: "unset !important"
            },
            "& > div > p": {
                marginTop: 12,
                marginBottom: 12,
                fontFamily: theme.typography.body1.fontFamily,
                marginBlockStart: "0.5em",
                marginBlockEnd: "0.5em"
            },
            "& > div > p.is-editor-empty:first-child::before": {
                color: "grey",
                content: "attr(data-placeholder)",
                float: "left",
                height: 0,
                pointerEvents: "none"
            }
        },
        button: {
            marginTop: -10,
            marginBottom: 15
        }
    }));
const $703eba3e46be7ee5$var$EmptyToolbar = ()=>null;
const $703eba3e46be7ee5$var$PostCommentForm = ({ context: context, placeholder: placeholder, helperText: helperText, mentions: mentions, userResource: userResource, addItem: addItem, removeItem: removeItem })=>{
    const record = (0, $jwOeV$reactadmin.useRecordContext)();
    const { identity: identity, isLoading: isLoading } = (0, $jwOeV$reactadmin.useGetIdentity)();
    const userDataModel = (0, $jwOeV$semappssemanticdataprovider.useDataModel)(userResource);
    const classes = $703eba3e46be7ee5$var$useStyles();
    const notify = (0, $jwOeV$reactadmin.useNotify)();
    const outbox = (0, $decfdd34cc00b80e$export$2e2bcd8739ae039)();
    const [expanded, setExpanded] = (0, $jwOeV$react.useState)(false);
    const [openAuth, setOpenAuth] = (0, $jwOeV$react.useState)(false);
    const onSubmit = (0, $jwOeV$react.useCallback)(async (values)=>{
        const document = new DOMParser().parseFromString(values.comment, "text/html");
        const mentions = Array.from(document.body.getElementsByClassName("mention"));
        const mentionedUsersUris = [];
        mentions.forEach((node)=>{
            const userUri = node.attributes["data-mention-id"].value;
            const userLabel = node.attributes["data-mention-label"].value;
            const link = document.createElement("a");
            link.setAttribute("href", `${new URL(window.location.href).origin}/${userResource}/${encodeURIComponent(userUri)}/show`);
            link.textContent = `@${userLabel}`;
            node.parentNode.replaceChild(link, node);
            mentionedUsersUris.push(userUri);
        });
        if (document.body.innerHTML === "undefined") notify("Votre commentaire est vide", {
            type: "error"
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
                    to: [
                        ...mentionedUsersUris,
                        (0, $ebea823cebb2f44b$export$4d8d554031975581)
                    ]
                });
                notify("Commentaire post\xe9 avec succ\xe8s", {
                    type: "success"
                });
            } catch (e) {
                console.error(e);
                removeItem(tempId);
                notify(e.message, {
                    type: "error"
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
    const openAuthIfDisconnected = (0, $jwOeV$react.useCallback)(()=>{
        if (!identity?.id) setOpenAuth(true);
    }, [
        identity,
        setOpenAuth
    ]);
    // Don't init the editor options until mentions and identity are loaded, as they can only be initialized once
    if (mentions && !mentions.items || isLoading) return null;
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$reactadmin.Form), {
                onSubmit: onSubmit,
                className: classes.form,
                children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$muimaterial.Box), {
                    className: classes.container,
                    onClick: openAuthIfDisconnected,
                    children: [
                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.Avatar), {
                            src: identity?.webIdData?.[userDataModel?.fieldsMapping?.image] || identity?.profileData?.[userDataModel?.fieldsMapping?.image],
                            className: classes.avatar
                        }),
                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$rainputrichtext.RichTextInput), {
                            source: "comment",
                            label: " ",
                            toolbar: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)($703eba3e46be7ee5$var$EmptyToolbar, {}),
                            fullWidth: true,
                            classes: {
                                editorContent: classes.editorContent
                            },
                            editorOptions: {
                                ...(0, $jwOeV$rainputrichtext.DefaultEditorOptions),
                                onFocus () {
                                    setExpanded(true);
                                },
                                extensions: [
                                    ...(0, $jwOeV$rainputrichtext.DefaultEditorOptions).extensions,
                                    placeholder ? (0, ($parcel$interopDefault($jwOeV$tiptapextensionplaceholder))).configure({
                                        placeholder: placeholder
                                    }) : null,
                                    mentions ? (0, $9b1343b281972d72$export$2e2bcd8739ae039).configure({
                                        HTMLAttributes: {
                                            class: "mention"
                                        },
                                        suggestion: mentions
                                    }) : null
                                ],
                                // Disable editor if user is not connected
                                editable: !!identity?.id
                            },
                            helperText: helperText
                        }),
                        expanded && /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.Button), {
                            type: "submit",
                            size: "small",
                            variant: "contained",
                            color: "primary",
                            endIcon: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, ($parcel$interopDefault($jwOeV$muiiconsmaterialSend))), {}),
                            className: classes.button,
                            children: "Envoyer"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$semappsauthprovider.AuthDialog), {
                open: openAuth,
                onClose: ()=>setOpenAuth(false),
                message: "Pour poster un commentaire, vous devez \xeatre connect\xe9."
            })
        ]
    });
};
var $703eba3e46be7ee5$export$2e2bcd8739ae039 = $703eba3e46be7ee5$var$PostCommentForm;









const $d68cd57b2d06b6d5$var$useStyles = (0, ($parcel$interopDefault($jwOeV$muistylesmakeStyles)))(()=>({
        container: {
            paddingLeft: 80,
            marginTop: 8,
            minHeight: 80,
            position: "relative"
        },
        avatar: {
            position: "absolute",
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
            fontWeight: "bold"
        },
        content: {
            "& p": {
                marginBlockStart: "0.5em",
                marginBlockEnd: "0.5em"
            }
        },
        loading: {
            zIndex: 1000,
            backgroundColor: "white",
            opacity: 0.5,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            marginTop: 5
        }
    }));
const $d68cd57b2d06b6d5$var$CommentsList = ({ comments: comments, userResource: userResource, loading: loading })=>{
    const classes = $d68cd57b2d06b6d5$var$useStyles();
    const userDataModel = (0, $jwOeV$semappssemanticdataprovider.useDataModel)(userResource);
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$muimaterial.Box), {
        position: "relative",
        children: [
            comments && comments.sort((a, b)=>new Date(b.published) - new Date(a.published)).map((comment)=>/*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$muimaterial.Box), {
                    className: classes.container,
                    children: [
                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.Box), {
                            className: classes.avatar,
                            children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$semappsfieldcomponents.ReferenceField), {
                                record: comment,
                                reference: userResource,
                                source: "attributedTo",
                                linkType: "show",
                                children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$semappsfieldcomponents.AvatarWithLabelField), {
                                    image: userDataModel?.fieldsMapping?.image
                                })
                            })
                        }),
                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$muimaterial.Box), {
                            className: classes.text,
                            children: [
                                /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$muimaterial.Typography), {
                                    variant: "body2",
                                    children: [
                                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$semappsfieldcomponents.ReferenceField), {
                                            record: comment,
                                            reference: userResource,
                                            source: "attributedTo",
                                            linkType: "show",
                                            children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$reactadmin.TextField), {
                                                variant: "body2",
                                                source: userDataModel?.fieldsMapping?.title,
                                                className: classes.label
                                            })
                                        }),
                                        "\xa0\u2022\xa0",
                                        /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$reactadmin.DateField), {
                                            record: comment,
                                            variant: "body2",
                                            source: "published",
                                            showTime: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$reactadmin.RichTextField), {
                                    record: comment,
                                    variant: "body1",
                                    source: "content",
                                    className: classes.content
                                })
                            ]
                        })
                    ]
                }, comment.id)),
            loading && /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.Box), {
                minHeight: 200,
                children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.Box), {
                    alignItems: "center",
                    className: classes.loading,
                    children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$muimaterial.CircularProgress), {
                        size: 60,
                        thickness: 6
                    })
                })
            })
        ]
    });
};
var $d68cd57b2d06b6d5$export$2e2bcd8739ae039 = $d68cd57b2d06b6d5$var$CommentsList;




const $2b75a2f49c9ef165$var$useCollection = (predicateOrUrl)=>{
    const { identity: identity, isLoading: identityLoading } = (0, $jwOeV$reactadmin.useGetIdentity)();
    const [items, setItems] = (0, $jwOeV$react.useState)([]);
    const [loading, setLoading] = (0, $jwOeV$react.useState)(false);
    const [loaded, setLoaded] = (0, $jwOeV$react.useState)(false);
    const [error, setError] = (0, $jwOeV$react.useState)(false);
    const collectionUrl = (0, $jwOeV$react.useMemo)(()=>{
        if (predicateOrUrl) {
            if (predicateOrUrl.startsWith("http")) return predicateOrUrl;
            if (identity?.webIdData) return identity?.webIdData?.[predicateOrUrl];
        }
    }, [
        identity,
        predicateOrUrl
    ]);
    const fetch = (0, $jwOeV$react.useCallback)(async ()=>{
        if (!collectionUrl) return;
        setLoading(true);
        const headers = new Headers({
            Accept: "application/ld+json"
        });
        // Add authorization token if it is set and if the user is on the same server as the collection
        const identityOrigin = identity.id && new URL(identity.id).origin;
        const collectionOrigin = new URL(collectionUrl).origin;
        const token = localStorage.getItem("token");
        if (identityOrigin === collectionOrigin && token) headers.set("Authorization", `Bearer ${token}`);
        (0, $jwOeV$reactadmin.fetchUtils).fetchJson(collectionUrl, {
            headers: headers
        }).then(({ json: json })=>{
            if (json && json.items) setItems(json.items);
            else if (json && json.orderedItems) setItems(json.orderedItems);
            else setItems([]);
            setError(false);
            setLoaded(true);
            setLoading(false);
        }).catch(()=>{
            setError(true);
            setLoaded(true);
            setLoading(false);
        });
    }, [
        setItems,
        setLoaded,
        setLoading,
        setError,
        collectionUrl,
        identity
    ]);
    (0, $jwOeV$react.useEffect)(()=>{
        if (!identityLoading && !loading && !loaded && !error) fetch();
    }, [
        fetch,
        identityLoading,
        loading,
        loaded,
        error
    ]);
    const addItem = (0, $jwOeV$react.useCallback)((item)=>{
        setItems((oldItems)=>[
                ...oldItems,
                item
            ]);
    }, [
        setItems
    ]);
    const removeItem = (0, $jwOeV$react.useCallback)((itemId)=>{
        setItems((oldItems)=>oldItems.filter((item)=>typeof item === "string" ? item !== itemId : item.id !== itemId));
    }, [
        setItems
    ]);
    return {
        items: items,
        loading: loading,
        loaded: loaded,
        error: error,
        refetch: fetch,
        addItem: addItem,
        removeItem: removeItem,
        url: collectionUrl
    };
};
var $2b75a2f49c9ef165$export$2e2bcd8739ae039 = $2b75a2f49c9ef165$var$useCollection;


const $2e5504cc4159ca8d$var$CommentsField = ({ source: source, context: context, helperText: helperText, placeholder: placeholder, userResource: userResource, mentions: mentions })=>{
    const record = (0, $jwOeV$reactadmin.useRecordContext)();
    const { items: comments, loading: loading, addItem: addItem, removeItem: removeItem } = (0, $2b75a2f49c9ef165$export$2e2bcd8739ae039)(record.replies);
    if (!userResource) throw new Error("No userResource defined for CommentsField");
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsxs)((0, $jwOeV$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $703eba3e46be7ee5$export$2e2bcd8739ae039), {
                context: context,
                helperText: helperText,
                userResource: userResource,
                placeholder: placeholder,
                mentions: mentions,
                addItem: addItem,
                removeItem: removeItem
            }),
            /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $d68cd57b2d06b6d5$export$2e2bcd8739ae039), {
                comments: comments,
                loading: loading,
                userResource: userResource
            })
        ]
    });
};
$2e5504cc4159ca8d$var$CommentsField.defaultProps = {
    label: "Commentaires",
    placeholder: "Commencez \xe0 taper votre commentaire...",
    source: "id",
    context: "id"
};
var $2e5504cc4159ca8d$export$2e2bcd8739ae039 = $2e5504cc4159ca8d$var$CommentsField;






const $505d598a33288aad$var$CollectionList = ({ collectionUrl: collectionUrl, resource: resource, children: children, ...rest })=>{
    if ((0, ($parcel$interopDefault($jwOeV$react))).Children.count(children) !== 1) throw new Error("<CollectionList> only accepts a single child");
    // TODO use a simple fetch call, as the resource is not good and it is useless
    const { data: collection, isLoading: isLoading } = (0, $jwOeV$reactadmin.useGetOne)(resource, collectionUrl, {
        enabled: !!collectionUrl
    });
    if (isLoading) return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)("div", {
        style: {
            marginTop: 8
        },
        children: /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$reactadmin.LinearProgress), {})
    });
    if (!collection) return null;
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $jwOeV$semappsfieldcomponents.ReferenceArrayField), {
        reference: resource,
        record: collection,
        source: "items",
        ...rest,
        children: children
    });
};
var $505d598a33288aad$export$2e2bcd8739ae039 = $505d598a33288aad$var$CollectionList;





const $b0c94a9bdea99da5$var$ReferenceCollectionField = ({ source: source, record: record, reference: reference, children: children, ...rest })=>{
    if ((0, ($parcel$interopDefault($jwOeV$react))).Children.count(children) !== 1) throw new Error("<ReferenceCollectionField> only accepts a single child");
    if (!record || !record[source]) return null;
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)((0, $505d598a33288aad$export$2e2bcd8739ae039), {
        resource: reference,
        collectionUrl: record[source],
        ...rest,
        children: children
    });
};
var $b0c94a9bdea99da5$export$2e2bcd8739ae039 = $b0c94a9bdea99da5$var$ReferenceCollectionField;






const $97664763db3c0a46$var$useInbox = ()=>{
    const { identity: identity } = (0, $jwOeV$reactadmin.useGetIdentity)();
    const inboxUrl = (0, $jwOeV$react.useMemo)(()=>{
        if (identity?.webIdData) return identity?.webIdData?.inbox;
    }, [
        identity
    ]);
    const sparqlEndpoint = (0, $jwOeV$react.useMemo)(()=>{
        if (identity?.webIdData) return identity?.webIdData?.endpoints?.["void:sparqlEndpoint"] || `${identity?.id}/sparql`;
    }, [
        identity
    ]);
    const fetch = (0, $jwOeV$react.useCallback)(async ({ filters: filters })=>{
        if (!sparqlEndpoint || !inboxUrl) return;
        const token = localStorage.getItem("token");
        const blankNodesQuery = (0, $jwOeV$semappssemanticdataprovider.buildBlankNodesQuery)([
            "as:object"
        ]);
        let filtersWhereQuery = "";
        if (filters) Object.keys(filters).forEach((predicate)=>{
            if (filters[predicate]) {
                const object = filters[predicate].startsWith("http") ? `<${filters[predicate]}>` : filters[predicate];
                filtersWhereQuery += `?s1 ${predicate} ${object} .`;
            }
        });
        const query = `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        CONSTRUCT {
          ?s1 ?p1 ?o1 .
          ${blankNodesQuery.construct}
        }
        WHERE {
          <${inboxUrl}> as:items ?s1 .
          ?s1 ?p1 ?o1 .
          FILTER( (isIRI(?s1)) ) .
          ${filtersWhereQuery}
          ${blankNodesQuery.where}
        }
      `;
        const { json: json } = await (0, $jwOeV$reactadmin.fetchUtils).fetchJson(sparqlEndpoint, {
            method: "POST",
            body: query,
            headers: new Headers({
                Accept: "application/ld+json",
                Authorization: token ? `Bearer ${token}` : undefined
            })
        });
        if (json["@graph"]) return json["@graph"];
        return null;
    }, [
        sparqlEndpoint,
        inboxUrl
    ]);
    return {
        fetch: fetch,
        url: inboxUrl,
        owner: identity?.id
    };
};
var $97664763db3c0a46$export$2e2bcd8739ae039 = $97664763db3c0a46$var$useInbox;





const $5b61553556e35016$var$useWebfinger = ()=>{
    // Post an activity to the logged user's outbox and return its URI
    const fetch = (0, $jwOeV$react.useCallback)(async (id)=>{
        // eslint-disable-next-line
        const [_, username, host] = id.split("@");
        if (host) {
            const protocol = host.includes(":") ? "http" : "https"; // If the host has a port, we are most likely on localhost
            const webfingerUrl = `${protocol}://${host}/.well-known/webfinger?resource=acct:${username}@${host}`;
            try {
                const { json: json } = await (0, $jwOeV$reactadmin.fetchUtils).fetchJson(webfingerUrl);
                const link = json.links.find((l)=>l.type === "application/activity+json");
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










const $27d3788851661769$var$useStyles = (0, ($parcel$interopDefault($jwOeV$muistylesmakeStyles)))((theme)=>({
        items: {
            background: "#fff",
            borderRadius: "0.5rem",
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)",
            color: "rgba(0, 0, 0, 0.8)",
            fontSize: "0.9rem",
            overflow: "hidden",
            padding: "0.2rem",
            position: "relative"
        },
        item: {
            background: "transparent",
            border: "1px solid transparent",
            borderRadius: "0.4rem",
            display: "block",
            margin: 0,
            padding: "0.2rem 0.4rem",
            textAlign: "left",
            width: "100%",
            "&.selected": {
                borderColor: "#000"
            }
        }
    }));
var $27d3788851661769$export$2e2bcd8739ae039 = /*#__PURE__*/ (0, $jwOeV$react.forwardRef)((props, ref)=>{
    const [selectedIndex, setSelectedIndex] = (0, $jwOeV$react.useState)(0);
    const classes = $27d3788851661769$var$useStyles();
    const selectItem = (index)=>{
        const item = props.items[index];
        if (item) props.command({
            id: item
        });
    };
    const upHandler = ()=>{
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };
    const downHandler = ()=>{
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };
    const enterHandler = ()=>{
        selectItem(selectedIndex);
    };
    (0, $jwOeV$react.useEffect)(()=>setSelectedIndex(0), [
        props.items
    ]);
    (0, $jwOeV$react.useImperativeHandle)(ref, ()=>({
            onKeyDown: ({ event: event })=>{
                if (event.key === "ArrowUp") {
                    upHandler();
                    return true;
                }
                if (event.key === "ArrowDown") {
                    downHandler();
                    return true;
                }
                if (event.key === "Enter") {
                    enterHandler();
                    return true;
                }
                return false;
            }
        }));
    return /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)("div", {
        className: classes.items,
        children: props.items.length ? props.items.map((item, index)=>/*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)("button", {
                className: classes.item + (index === selectedIndex ? " selected" : ""),
                onClick: ()=>selectItem(index),
                children: item.label
            }, index)) : /*#__PURE__*/ (0, $jwOeV$reactjsxruntime.jsx)("div", {
            className: classes.item,
            children: "Aucun r\xe9sultat"
        })
    });
});


const $7b7f4b18327176f8$var$renderMentions = ()=>{
    let component;
    let popup;
    return {
        onStart: (props)=>{
            component = new (0, $jwOeV$tiptapreact.ReactRenderer)((0, $27d3788851661769$export$2e2bcd8739ae039), {
                props: props,
                editor: props.editor
            });
            popup = (0, ($parcel$interopDefault($jwOeV$tippyjs)))("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: ()=>document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start"
            });
        },
        onUpdate (props) {
            component.updateProps(props);
            popup[0].setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onKeyDown (props) {
            if (props.event.key === "Escape") {
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
var $7b7f4b18327176f8$export$2e2bcd8739ae039 = $7b7f4b18327176f8$var$renderMentions;


const $968ea07fb81eda0b$var$useMentions = (userResource)=>{
    const userDataModel = (0, $jwOeV$semappssemanticdataprovider.useDataModel)(userResource);
    const { data: data } = (0, $jwOeV$reactadmin.useGetList)(userResource, {
        filter: {
            _predicates: [
                userDataModel?.fieldsMapping?.title
            ],
            blankNodes: []
        }
    }, {
        enabled: !!userDataModel?.fieldsMapping?.title
    });
    const availableMentions = (0, $jwOeV$react.useMemo)(()=>{
        if (data) return data.map((item)=>({
                id: item.id,
                label: item[userDataModel?.fieldsMapping?.title]
            }));
    }, [
        data
    ]);
    const items = (0, $jwOeV$react.useMemo)(()=>{
        if (availableMentions) return ({ query: query })=>{
            return availableMentions.filter(({ label: label })=>label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
        };
    }, [
        availableMentions
    ]);
    return {
        items: items,
        render: (0, $7b7f4b18327176f8$export$2e2bcd8739ae039)
    };
};
var $968ea07fb81eda0b$export$2e2bcd8739ae039 = $968ea07fb81eda0b$var$useMentions;





//# sourceMappingURL=index.cjs.js.map
