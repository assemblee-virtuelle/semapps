var $gJbUX$reactjsxruntime = require("react/jsx-runtime");
var $gJbUX$react = require("react");
var $gJbUX$reactadmin = require("react-admin");
var $gJbUX$muimaterial = require("@mui/material");
var $gJbUX$muiiconsmaterialLaunch = require("@mui/icons-material/Launch");
var $gJbUX$reacthookform = require("react-hook-form");
var $gJbUX$muiiconsmaterialAdd = require("@mui/icons-material/Add");
var $gJbUX$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $gJbUX$lodashdebounce = require("lodash.debounce");
var $gJbUX$muiiconsmaterialVisibility = require("@mui/icons-material/Visibility");
var $gJbUX$muiiconsmaterialError = require("@mui/icons-material/Error");
var $gJbUX$muiiconsmaterialLanguage = require("@mui/icons-material/Language");
var $gJbUX$muiiconsmaterialFacebook = require("@mui/icons-material/Facebook");
var $gJbUX$muiiconsmaterialGitHub = require("@mui/icons-material/GitHub");
var $gJbUX$muiiconsmaterialTwitter = require("@mui/icons-material/Twitter");
var $gJbUX$muiiconsmaterialInstagram = require("@mui/icons-material/Instagram");
var $gJbUX$muiiconsmaterialYouTube = require("@mui/icons-material/YouTube");
var $gJbUX$reacticonsfi = require("react-icons/fi");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "AvatarWithLabelField", () => $3f018d83d5c220cb$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceArrayField", () => $a8998e9160935747$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceField", () => $b30f322c513cbc10$export$2e2bcd8739ae039);
$parcel$export(module.exports, "QuickAppendReferenceArrayField", () => $c15a04bb86f69ac4$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiUrlField", () => $8e04b489ede64e08$export$2e2bcd8739ae039);
$parcel$export(module.exports, "SeparatedListField", () => $d392e56952d41657$export$2e2bcd8739ae039);





const $3f018d83d5c220cb$var$useStyles = (0, $gJbUX$muimaterial.makeStyles)((theme)=>({
        parent: (props)=>({
                position: 'relative',
                ...props.parent
            }),
        square: {
            width: '100%',
            paddingBottom: '100%',
            position: 'relative'
        },
        avatar: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            // backgroundColor: theme.palette.primary.main,
            '& svg': {
                width: '55%',
                height: '55%'
            }
        },
        chip: {
            position: 'absolute',
            bottom: -10,
            left: 0,
            right: 0,
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 6,
            paddingRight: 6,
            marginBottom: 10,
            cursor: 'pointer'
        },
        launchIcon: {
            width: 14
        }
    }));
const $3f018d83d5c220cb$var$handleClick = ()=>{};
const $3f018d83d5c220cb$var$AvatarWithLabelField = ({ label: label, defaultLabel: defaultLabel, image: image, fallback: fallback, externalLink: externalLink = false, labelColor: labelColor = 'secondary', classes: classes, ...rest })=>{
    classes = $3f018d83d5c220cb$var$useStyles(classes);
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const computedLabel = (typeof label === 'function' ? label(record) : record[label]) || defaultLabel;
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const computedImage = typeof image === 'function' ? image(record) : record[image];
    const computedFallback = typeof fallback === 'function' ? fallback(record) : fallback;
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.Box), {
        className: classes.parent,
        children: [
            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("div", {
                className: classes.square,
                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                    src: computedImage || computedFallback,
                    alt: computedLabel,
                    fallback: computedFallback,
                    ...rest,
                    className: classes.avatar
                })
            }),
            !computedLabel ? null : externalLink ? /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel,
                deleteIcon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialLaunch))), {
                    className: classes.launchIcon
                }),
                onDelete: $3f018d83d5c220cb$var$handleClick
            }) : /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel
            })
        ]
    });
};
var $3f018d83d5c220cb$export$2e2bcd8739ae039 = $3f018d83d5c220cb$var$AvatarWithLabelField;





const $a8998e9160935747$var$ReferenceArrayField = ({ source: source, ...otherProps })=>{
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    if (record?.[source]) {
        if (!Array.isArray(record[source])) record[source] = [
            record[source]
        ];
        record[source] = record[source].map((i)=>i['@id'] || i.id || i);
    }
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.ReferenceArrayField), {
            source: source,
            ...otherProps
        })
    });
};
var $a8998e9160935747$export$2e2bcd8739ae039 = $a8998e9160935747$var$ReferenceArrayField;





const $b30f322c513cbc10$var$ReferenceField = ({ source: source, ...otherProps })=>{
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (record[source]) // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    {
        if (typeof record[source] === 'object') // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        record[source] = record[source]['@id'] || record[source].id;
    }
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.ReferenceField), {
            record: record,
            source: source,
            ...otherProps
        })
    });
};
var $b30f322c513cbc10$export$2e2bcd8739ae039 = $b30f322c513cbc10$var$ReferenceField;






















const $f47ebe41860d457c$var$useStyles = (0, $gJbUX$muimaterial.makeStyles)((theme)=>({
        root: {
            width: '100%',
            maxWidth: '100%',
            backgroundColor: theme.palette.background.paper,
            paddingTop: 0,
            paddingBottom: 0
        },
        primaryText: {
            width: '30%'
        },
        secondaryText: {
            fontStyle: 'italic',
            color: 'grey'
        }
    }));
const $f47ebe41860d457c$var$getServerName = (resourceUri, dataServers)=>{
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    const server = dataServers && Object.values(dataServers).find((server)=>resourceUri.startsWith(server.baseUrl));
    return server ? server.name : 'Inconnu';
};
const $f47ebe41860d457c$var$ResultsList = ({ keyword: keyword, source: source, reference: reference, appendLink: appendLink, switchToCreate: switchToCreate })=>{
    const classes = $f47ebe41860d457c$var$useStyles();
    const [loading, setLoading] = (0, $gJbUX$react.useState)(false);
    const [loaded, setLoaded] = (0, $gJbUX$react.useState)(false);
    const [results, setResults] = (0, $gJbUX$react.useState)([]);
    const translate = (0, $gJbUX$reactadmin.useTranslate)();
    const dataProvider = (0, $gJbUX$reactadmin.useDataProvider)();
    const dataServers = (0, $gJbUX$semappssemanticdataprovider.useDataServers)();
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    const createPath = (0, $gJbUX$reactadmin.useCreatePath)();
    const referenceDefinition = (0, $gJbUX$reactadmin.useResourceDefinition)({
        resource: reference
    });
    const getResourceLabel = (0, $gJbUX$reactadmin.useGetResourceLabel)();
    const dataModel = (0, $gJbUX$semappssemanticdataprovider.useDataModel)(reference);
    if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title) throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
    const search = (0, $gJbUX$react.useMemo)(()=>(0, ($parcel$interopDefault($gJbUX$lodashdebounce)))((keyword)=>{
            dataProvider.getList(reference, {
                pagination: {
                    page: 1,
                    perPage: 100
                },
                // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
                sort: {
                    field: dataModel?.fieldsMapping?.title,
                    order: 'ASC'
                },
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                filter: {
                    q: keyword,
                    _predicates: [
                        dataModel.fieldsMapping.title
                    ],
                    _servers: '@all'
                }
            }).then(({ data: data })=>{
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                const existingLinks = record[source] ? Array.isArray(record[source]) ? record[source] : [
                    record[source]
                ] : [];
                const newLinks = data.filter((record)=>!existingLinks.includes(record.id));
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
                setResults(newLinks);
                setLoaded(true);
                setLoading(false);
            }).catch((e)=>{
                setLoading(false);
            });
        }, 700), [
        dataProvider,
        dataModel,
        record,
        source,
        reference,
        setResults,
        setLoading,
        setLoaded
    ]);
    (0, $gJbUX$react.useEffect)(()=>{
        if (!keyword) return undefined;
        setLoading(true);
        setLoaded(false);
        search(keyword);
        return ()=>search.cancel();
    }, [
        keyword,
        search,
        setLoading
    ]);
    if (!keyword) return null;
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.List), {
        dense: true,
        className: classes.root,
        children: [
            loaded && results.map((resource)=>// @ts-expect-error TS(2769): No overload matches this call.
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                    button: true,
                    onClick: ()=>appendLink(resource.id),
                    children: [
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                                children: /*#__PURE__*/ (0, ($parcel$interopDefault($gJbUX$react))).createElement(referenceDefinition.icon)
                            })
                        }),
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                            className: classes.primaryText,
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            primary: resource[dataModel.fieldsMapping.title]
                        }),
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                            className: classes.secondaryText,
                            // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
                            primary: $f47ebe41860d457c$var$getServerName(resource.id, dataServers)
                        }),
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemSecondaryAction), {
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("a", {
                                // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
                                href: createPath({
                                    resource: reference,
                                    id: resource.id,
                                    type: 'show'
                                }),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.IconButton), {
                                    edge: "end",
                                    size: "large",
                                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialVisibility))), {})
                                })
                            })
                        })
                    ]
                }, resource.id)),
            loaded && results.length === 0 && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                children: [
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialError))), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                        className: classes.primaryText,
                        primary: translate('ra.navigation.no_results')
                    })
                ]
            }),
            loaded && referenceDefinition.hasCreate && // @ts-expect-error TS(2769): No overload matches this call.
            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                button: true,
                onClick: switchToCreate,
                children: [
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialAdd))), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                        className: classes.primaryText,
                        primary: translate('ra.page.create', {
                            name: getResourceLabel(reference, 1)
                        })
                    })
                ]
            }),
            loading && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Box), {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.CircularProgress), {
                    size: 60,
                    thickness: 6
                })
            })
        ]
    });
};
var $f47ebe41860d457c$export$2e2bcd8739ae039 = $f47ebe41860d457c$var$ResultsList;


const $e2e32dffa6383430$var$useStyles = (0, $gJbUX$muimaterial.makeStyles)(()=>({
        title: {
            paddingBottom: 8
        },
        actions: {
            padding: 15
        },
        addForm: {
            paddingTop: 0
        },
        listForm: {
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 0,
            paddingBottom: 0,
            maxHeight: 210
        }
    }));
const $e2e32dffa6383430$var$QuickAppendDialog = ({ open: open, onClose: onClose, subjectUri: subjectUri, source: source, reference: reference })=>{
    const classes = $e2e32dffa6383430$var$useStyles();
    const { resource: resource } = (0, $gJbUX$reactadmin.useShowContext)();
    const [keyword, setKeyword] = (0, $gJbUX$react.useState)('');
    const [panel, setPanel] = (0, $gJbUX$react.useState)('find');
    const dataProvider = (0, $gJbUX$reactadmin.useDataProvider)();
    const translate = (0, $gJbUX$reactadmin.useTranslate)();
    const refresh = (0, $gJbUX$reactadmin.useRefresh)();
    const notify = (0, $gJbUX$reactadmin.useNotify)();
    const getResourceLabel = (0, $gJbUX$reactadmin.useGetResourceLabel)();
    const dataModel = (0, $gJbUX$semappssemanticdataprovider.useDataModel)(reference);
    const { register: register, setValue: setValue, handleSubmit: handleSubmit } = (0, $gJbUX$reacthookform.useForm)();
    const appendLink = (0, $gJbUX$react.useCallback)(async (objectUri)=>{
        // Get the freshest data so that the put operation doesn't overwrite anything
        const { data: data } = await dataProvider.getOne(resource, {
            id: subjectUri
        });
        await dataProvider.update(resource, {
            id: subjectUri,
            data: {
                ...data,
                [source]: data[source] ? Array.isArray(data[source]) ? [
                    ...data[source],
                    objectUri
                ] : [
                    data[source],
                    objectUri
                ] : objectUri
            },
            previousData: data
        });
        refresh();
        onClose();
    }, [
        dataProvider,
        subjectUri,
        resource,
        source,
        refresh,
        onClose
    ]);
    const create = (0, $gJbUX$react.useCallback)(async (values)=>{
        const { data: data } = await dataProvider.create(reference, {
            data: {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                [dataModel.fieldsMapping.title]: values.title
            }
        });
        await appendLink(data.id);
        notify(`La resource "${values.title}" a \xe9t\xe9 cr\xe9\xe9e`, {
            type: 'success'
        });
    }, [
        dataProvider,
        dataModel,
        appendLink,
        reference,
        notify
    ]);
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: panel === 'find' ? /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$reactjsxruntime.Fragment), {
            children: [
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogTitle), {
                    className: classes.title,
                    children: "Ajouter une relation"
                }),
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.TextField), {
                        autoFocus: true,
                        label: `Rechercher ou cr\xe9er des ${getResourceLabel(reference, 2).toLowerCase()}`,
                        variant: "filled",
                        margin: "dense",
                        value: keyword,
                        onChange: (e)=>setKeyword(e.target.value),
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                    className: classes.listForm,
                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $f47ebe41860d457c$export$2e2bcd8739ae039), {
                        keyword: keyword,
                        source: source,
                        reference: reference,
                        appendLink: appendLink,
                        switchToCreate: ()=>{
                            setValue('title', keyword);
                            setPanel('create');
                        }
                    })
                }),
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogActions), {
                    className: classes.actions,
                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                        label: "ra.action.close",
                        variant: "text",
                        onClick: onClose
                    })
                })
            ]
        }) : /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("form", {
            onSubmit: handleSubmit(create),
            children: [
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogTitle), {
                    className: classes.title,
                    children: translate('ra.page.create', {
                        name: getResourceLabel(reference, 1)
                    })
                }),
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.TextField), {
                        ...register('title'),
                        autoFocus: true,
                        label: "Titre",
                        variant: "filled",
                        margin: "dense",
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.DialogActions), {
                    className: classes.actions,
                    children: [
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                            label: "ra.action.create",
                            variant: "contained",
                            startIcon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialAdd))), {}),
                            type: "submit"
                        }),
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                            label: "ra.action.close",
                            variant: "text",
                            onClick: onClose
                        })
                    ]
                })
            ]
        })
    });
};
var $e2e32dffa6383430$export$2e2bcd8739ae039 = $e2e32dffa6383430$var$QuickAppendDialog;


const $c15a04bb86f69ac4$var$QuickAppendReferenceArrayField = ({ reference: reference, source: source, resource: resource, children: children, ...otherProps })=>{
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    const [showDialog, setShowDialog] = (0, $gJbUX$react.useState)(false);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const { permissions: permissions } = (0, $gJbUX$reactadmin.usePermissions)({
        uri: record.id
    });
    const canAppend = (0, $gJbUX$react.useMemo)(()=>!!permissions && permissions.some((p)=>[
                'acl:Append',
                'acl:Write',
                'acl:Control'
            ].includes(p['acl:mode'])), [
        permissions
    ]);
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $a8998e9160935747$export$2e2bcd8739ae039), {
                reference: reference,
                source: source,
                ...otherProps,
                children: (0, ($parcel$interopDefault($gJbUX$react))).Children.only(children) && /*#__PURE__*/ (0, ($parcel$interopDefault($gJbUX$react))).cloneElement(children, {
                    appendLink: canAppend ? ()=>setShowDialog(true) : undefined
                })
            }),
            canAppend && showDialog && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $e2e32dffa6383430$export$2e2bcd8739ae039), {
                open: showDialog,
                onClose: ()=>setShowDialog(false),
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                subjectUri: record.id,
                resource: resource,
                source: source,
                reference: reference
            })
        ]
    });
};
var $c15a04bb86f69ac4$export$2e2bcd8739ae039 = $c15a04bb86f69ac4$var$QuickAppendReferenceArrayField;













const $8e04b489ede64e08$var$defaultdomainMapping = {
    'github.com': {
        label: 'GitHub',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialGitHub))), {}),
        color: 'black',
        contrastText: 'white'
    },
    'gitlab.com': {
        label: 'GitLab',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reacticonsfi.FiGitlab), {}),
        color: 'orange',
        contrastText: 'black'
    },
    'opencollective.com': {
        label: 'Open Collective',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
            component: "span",
            src: "https://opencollective.com/static/images/opencollective-icon.svg"
        }),
        color: 'white',
        contrastText: '#297EFF'
    },
    'facebook.com': {
        label: 'Facebook',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialFacebook))), {}),
        color: '#4267B2',
        contrastText: 'white'
    },
    'twitter.com': {
        label: 'Twitter',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialTwitter))), {}),
        color: '#00ACEE',
        contrastText: 'white'
    },
    'instagram.com': {
        label: 'Instagram',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialInstagram))), {}),
        color: '#8a3ab9',
        contrastText: 'white'
    },
    'youtube.com': {
        label: 'YouTube',
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialYouTube))), {}),
        color: '#FF0000',
        contrastText: 'white'
    }
};
const $8e04b489ede64e08$var$useStyles = (0, $gJbUX$muimaterial.makeStyles)(()=>({
        link: {
            textDecoration: 'unset',
            '& :hover': {
                cursor: 'pointer'
            }
        },
        chip: {
            paddingLeft: 5,
            paddingRight: 5,
            marginRight: 5,
            marginBottom: 5
        },
        label: {
            marginTop: -1
        }
    }));
const $8e04b489ede64e08$var$MultiUrlField = ({ source: source, domainMapping: domainMapping })=>{
    const newDomainMapping = {
        ...$8e04b489ede64e08$var$defaultdomainMapping,
        ...domainMapping
    };
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    const classes = $8e04b489ede64e08$var$useStyles();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const urlArray = record[source] ? Array.isArray(record[source]) ? record[source] : [
        record[source]
    ] : [];
    return urlArray.map((url, index)=>{
        if (!url.startsWith('http')) url = `https://${url}`;
        let parsedUrl = null;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            return null;
        }
        const chip = newDomainMapping[parsedUrl.hostname] || {
            label: 'Site web',
            icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialLanguage))), {}),
            color: '#ea',
            contrastText: 'black'
        };
        return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("a", {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: classes.link,
            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                component: "span",
                icon: /*#__PURE__*/ (0, ($parcel$interopDefault($gJbUX$react))).cloneElement(chip.icon, {
                    style: {
                        color: chip.contrastText,
                        width: 18,
                        height: 18
                    }
                }),
                size: "small",
                label: chip.label,
                classes: {
                    root: classes.chip,
                    label: classes.label
                },
                style: {
                    color: chip.contrastText,
                    backgroundColor: chip.color
                }
            })
        }, index);
    });
};
var $8e04b489ede64e08$export$2e2bcd8739ae039 = $8e04b489ede64e08$var$MultiUrlField;






// useful to prevent click bubbling in a datagrid with rowClick
const $d392e56952d41657$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $d392e56952d41657$var$handleClick = ()=>{};
const $d392e56952d41657$var$SeparatedListField = (props)=>{
    let { children: children, link: link = 'edit', linkType: linkType, separator: separator = ',\u00A0' } = props;
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    const { data: data, isLoading: isLoading, resource: resource } = (0, $gJbUX$reactadmin.useListContext)(props);
    const createPath = (0, $gJbUX$reactadmin.useCreatePath)();
    if (linkType !== undefined) {
        console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
        link = linkType;
    }
    if (isLoading) return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.LinearProgress), {});
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactjsxruntime.Fragment), {
        children: // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        data.map((record, i)=>{
            if (!record.id) return null;
            const resourceLinkPath = link !== false && (typeof link === 'function' ? link(record.id) : createPath({
                resource: resource,
                id: record.id,
                type: link
            }));
            if (resourceLinkPath) return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Link), {
                        to: resourceLinkPath,
                        onClick: $d392e56952d41657$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $gJbUX$react.cloneElement)((0, $gJbUX$react.Children).only(children), {
                            // Workaround to force ChipField to be clickable
                            onClick: $d392e56952d41657$var$handleClick
                        })
                    }),
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    i < data.length - 1 && separator
                ]
            }, record.id);
            return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
                        value: record,
                        children: children
                    }),
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    i < data.length - 1 && separator
                ]
            }, record.id);
        })
    });
};
var $d392e56952d41657$export$2e2bcd8739ae039 = $d392e56952d41657$var$SeparatedListField;




//# sourceMappingURL=index.cjs.js.map
