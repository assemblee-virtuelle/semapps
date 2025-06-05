var $gJbUX$reactjsxruntime = require("react/jsx-runtime");
var $gJbUX$react = require("react");
var $gJbUX$reactadmin = require("react-admin");
var $gJbUX$muimaterial = require("@mui/material");
var $gJbUX$muistylesmakeStyles = require("@mui/styles/makeStyles");
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


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "AvatarWithLabelField", () => $4e17293ac0574285$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ReferenceArrayField", () => $b6ed9e2776cb4ba3$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ReferenceField", () => $387e8196d8654c58$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "QuickAppendReferenceArrayField", () => $6a1cce6d258bf615$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MultiUrlField", () => $732a429355ed7119$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "SeparatedListField", () => $43c570e3fbe4d9a0$export$2e2bcd8739ae039);






// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $4e17293ac0574285$var$useStyles = (0, ($parcel$interopDefault($gJbUX$muistylesmakeStyles)))((theme: any) => ({
    parent: (props: any) => ({
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
const $4e17293ac0574285$var$handleClick = ()=>{};
// @ts-expect-error TS(7031): Binding element 'label' implicitly has an 'any' ty... Remove this comment to see the full error message
const $4e17293ac0574285$var$AvatarWithLabelField = ({ label: label, defaultLabel: defaultLabel, image: image, fallback: fallback, externalLink: externalLink = false, labelColor: labelColor = 'secondary', classes: classes, ...rest })=>{
    classes = $4e17293ac0574285$var$useStyles(classes);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    const computedLabel = (typeof label === 'function' ? label(record) : record[label]) || defaultLabel;
    const computedImage = typeof image === 'function' ? image(record) : record[image];
    const computedFallback = typeof fallback === 'function' ? fallback(record) : fallback;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.Box), {
        className: classes.parent,
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("div", {
                className: classes.square,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                    src: computedImage || computedFallback,
                    alt: computedLabel,
                    fallback: computedFallback,
                    ...rest,
                    className: classes.avatar
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            !computedLabel ? null : externalLink ? /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                deleteIcon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialLaunch))), {
                    className: classes.launchIcon
                }),
                onDelete: $4e17293ac0574285$var$handleClick
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            }) : /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel
            })
        ]
    });
};
var $4e17293ac0574285$export$2e2bcd8739ae039 = $4e17293ac0574285$var$AvatarWithLabelField;





// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $b6ed9e2776cb4ba3$var$ReferenceArrayField = ({ source: source, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    if (record?.[source]) {
        if (!Array.isArray(record[source])) record[source] = [
            record[source]
        ];
        record[source] = record[source].map((i: any) => i['@id'] || i.id || i);
    }
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
        value: record,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.ReferenceArrayField), {
            source: source,
            ...otherProps
        })
    });
};
var $b6ed9e2776cb4ba3$export$2e2bcd8739ae039 = $b6ed9e2776cb4ba3$var$ReferenceArrayField;





// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $387e8196d8654c58$var$ReferenceField = ({ source: source, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    if (record[source]) {
        if (typeof record[source] === 'object') record[source] = record[source]['@id'] || record[source].id;
    }
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
        value: record,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.ReferenceField), {
            record: record,
            source: source,
            ...otherProps
        })
    });
};
var $387e8196d8654c58$export$2e2bcd8739ae039 = $387e8196d8654c58$var$ReferenceField;
























// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $c7e6f337903f861b$var$useStyles = (0, ($parcel$interopDefault($gJbUX$muistylesmakeStyles)))((theme: any) => ({
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
const $c7e6f337903f861b$var$getServerName = (resourceUri: any, dataServers: any)=>{
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    const server = dataServers && Object.values(dataServers).find((server)=>resourceUri.startsWith(server.baseUrl));
    return server ? server.name : 'Inconnu';
};
// @ts-expect-error TS(7031): Binding element 'keyword' implicitly has an 'any' ... Remove this comment to see the full error message
const $c7e6f337903f861b$var$ResultsList = ({ keyword: keyword, source: source, reference: reference, appendLink: appendLink, switchToCreate: switchToCreate })=>{
    const classes = $c7e6f337903f861b$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [loading, setLoading] = (0, $gJbUX$react.useState)(false);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [loaded, setLoaded] = (0, $gJbUX$react.useState)(false);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [results, setResults] = (0, $gJbUX$react.useState)([]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $gJbUX$reactadmin.useTranslate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $gJbUX$reactadmin.useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $gJbUX$semappssemanticdataprovider.useDataServers)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createPath = (0, $gJbUX$reactadmin.useCreatePath)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const referenceDefinition = (0, $gJbUX$reactadmin.useResourceDefinition)({
        resource: reference
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getResourceLabel = (0, $gJbUX$reactadmin.useGetResourceLabel)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataModel = (0, $gJbUX$semappssemanticdataprovider.useDataModel)(reference);
    if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title) throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const search = (0, $gJbUX$react.useMemo)(()=>(0, ($parcel$interopDefault($gJbUX$lodashdebounce)))((keyword: any) => {
            dataProvider.getList(reference, {
                pagination: {
                    page: 1,
                    perPage: 100
                },
                sort: {
                    field: dataModel?.fieldsMapping?.title,
                    order: 'ASC'
                },
                filter: {
                    q: keyword,
                    _predicates: [
                        dataModel.fieldsMapping.title
                    ],
                    _servers: '@all'
                }
            // @ts-expect-error TS(7031): Binding element 'data' implicitly has an 'any' typ... Remove this comment to see the full error message
            }).then(({ data: data })=>{
                const existingLinks = record[source] ? Array.isArray(record[source]) ? record[source] : [
                    record[source]
                ] : [];
                const newLinks = data.filter((record: any) => !existingLinks.includes(record.id));
                setResults(newLinks);
                setLoaded(true);
                setLoading(false);
            }).catch((e: any) => {
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.List), {
            dense: true,
            className: classes.root,
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                loaded && results.map((resource: any) => /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                        button: true,
                        onClick: ()=>appendLink(resource.id),
                        children: [
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: /*#__PURE__*/ (0, ($parcel$interopDefault($gJbUX$react))).createElement(referenceDefinition.icon)
                                })
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                                className: classes.primaryText,
                                primary: resource[dataModel.fieldsMapping.title]
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                                className: classes.secondaryText,
                                primary: $c7e6f337903f861b$var$getServerName(resource.id, dataServers)
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemSecondaryAction), {
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("a", {
                                    href: createPath({
                                        resource: reference,
                                        id: resource.id,
                                        type: 'show'
                                    }),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.IconButton), {
                                        edge: "end",
                                        size: "large",
                                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialVisibility))), {})
                                    })
                                })
                            })
                        ]
                    }, resource.id)),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                loaded && results.length === 0 && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialError))), {})
                            })
                        }),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                            className: classes.primaryText,
                            primary: translate('ra.navigation.no_results')
                        })
                    ]
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                loaded && referenceDefinition.hasCreate && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.ListItem), {
                    button: true,
                    onClick: switchToCreate,
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemAvatar), {
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialAdd))), {})
                            })
                        }),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.ListItemText), {
                            className: classes.primaryText,
                            primary: translate('ra.page.create', {
                                name: getResourceLabel(reference, 1)
                            })
                        })
                    ]
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                loading && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Box), {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 150,
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.CircularProgress), {
                        size: 60,
                        thickness: 6
                    })
                })
            ]
        })
    );
};
var $c7e6f337903f861b$export$2e2bcd8739ae039 = $c7e6f337903f861b$var$ResultsList;


// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $9ac0ba4780250906$var$useStyles = (0, ($parcel$interopDefault($gJbUX$muistylesmakeStyles)))(()=>({
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
// @ts-expect-error TS(7031): Binding element 'open' implicitly has an 'any' typ... Remove this comment to see the full error message
const $9ac0ba4780250906$var$QuickAppendDialog = ({ open: open, onClose: onClose, subjectUri: subjectUri, source: source, reference: reference })=>{
    const classes = $9ac0ba4780250906$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { resource: resource } = (0, $gJbUX$reactadmin.useShowContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [keyword, setKeyword] = (0, $gJbUX$react.useState)('');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [panel, setPanel] = (0, $gJbUX$react.useState)('find');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $gJbUX$reactadmin.useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $gJbUX$reactadmin.useTranslate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const refresh = (0, $gJbUX$reactadmin.useRefresh)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const notify = (0, $gJbUX$reactadmin.useNotify)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getResourceLabel = (0, $gJbUX$reactadmin.useGetResourceLabel)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataModel = (0, $gJbUX$semappssemanticdataprovider.useDataModel)(reference);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { register: register, setValue: setValue, handleSubmit: handleSubmit } = (0, $gJbUX$reacthookform.useForm)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const appendLink = (0, $gJbUX$react.useCallback)(async (objectUri: any) => {
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const create = (0, $gJbUX$react.useCallback)(async (values: any) => {
        const { data: data } = await dataProvider.create(reference, {
            data: {
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
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Dialog), {
            fullWidth: true,
            open: open,
            onClose: onClose,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            children: panel === 'find' ? /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$reactjsxruntime.Fragment), {
                children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogTitle), {
                        className: classes.title,
                        children: "Ajouter une relation"
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                        className: classes.addForm,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.TextField), {
                            autoFocus: true,
                            label: `Rechercher ou cr\xe9er des ${getResourceLabel(reference, 2).toLowerCase()}`,
                            variant: "filled",
                            margin: "dense",
                            value: keyword,
                            onChange: (e: any) => setKeyword(e.target.value),
                            fullWidth: true
                        })
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                        className: classes.listForm,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $c7e6f337903f861b$export$2e2bcd8739ae039), {
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
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogActions), {
                        className: classes.actions,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                            label: "ra.action.close",
                            variant: "text",
                            onClick: onClose
                        })
                    })
                ]
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            }) : /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("form", {
                onSubmit: handleSubmit(create),
                children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogTitle), {
                        className: classes.title,
                        children: translate('ra.page.create', {
                            name: getResourceLabel(reference, 1)
                        })
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.DialogContent), {
                        className: classes.addForm,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.TextField), {
                            ...register('title'),
                            autoFocus: true,
                            label: "Titre",
                            variant: "filled",
                            margin: "dense",
                            fullWidth: true
                        })
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$muimaterial.DialogActions), {
                        className: classes.actions,
                        children: [
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                                label: "ra.action.create",
                                variant: "contained",
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                startIcon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialAdd))), {}),
                                type: "submit"
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Button), {
                                label: "ra.action.close",
                                variant: "text",
                                onClick: onClose
                            })
                        ]
                    })
                ]
            })
        })
    );
};
var $9ac0ba4780250906$export$2e2bcd8739ae039 = $9ac0ba4780250906$var$QuickAppendDialog;


// @ts-expect-error TS(7031): Binding element 'reference' implicitly has an 'any... Remove this comment to see the full error message
const $6a1cce6d258bf615$var$QuickAppendReferenceArrayField = ({ reference: reference, source: source, resource: resource, children: children, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [showDialog, setShowDialog] = (0, $gJbUX$react.useState)(false);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { permissions: permissions } = (0, $gJbUX$reactadmin.usePermissions)({
        uri: record.id
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const canAppend = (0, $gJbUX$react.useMemo)(()=>!!permissions && permissions.some((p: any) => [
                'acl:Append',
                'acl:Write',
                'acl:Control'
            ].includes(p['acl:mode'])), [
        permissions
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)((0, $gJbUX$reactjsxruntime.Fragment), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $b6ed9e2776cb4ba3$export$2e2bcd8739ae039), {
                reference: reference,
                source: source,
                ...otherProps,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: (0, ($parcel$interopDefault($gJbUX$react))).Children.only(children) && /*#__PURE__*/ (0, ($parcel$interopDefault($gJbUX$react))).cloneElement(children, {
                    appendLink: canAppend ? ()=>setShowDialog(true) : undefined
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            canAppend && showDialog && /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $9ac0ba4780250906$export$2e2bcd8739ae039), {
                open: showDialog,
                onClose: ()=>setShowDialog(false),
                subjectUri: record.id,
                resource: resource,
                source: source,
                reference: reference
            })
        ]
    });
};
var $6a1cce6d258bf615$export$2e2bcd8739ae039 = $6a1cce6d258bf615$var$QuickAppendReferenceArrayField;














const $732a429355ed7119$var$defaultdomainMapping = {
    'github.com': {
        label: 'GitHub',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialGitHub))), {}),
        color: 'black',
        contrastText: 'white'
    },
    'gitlab.com': {
        label: 'GitLab',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reacticonsfi.FiGitlab), {}),
        color: 'orange',
        contrastText: 'black'
    },
    'opencollective.com': {
        label: 'Open Collective',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Avatar), {
            component: "span",
            src: "https://opencollective.com/static/images/opencollective-icon.svg"
        }),
        color: 'white',
        contrastText: '#297EFF'
    },
    'facebook.com': {
        label: 'Facebook',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialFacebook))), {}),
        color: '#4267B2',
        contrastText: 'white'
    },
    'twitter.com': {
        label: 'Twitter',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialTwitter))), {}),
        color: '#00ACEE',
        contrastText: 'white'
    },
    'instagram.com': {
        label: 'Instagram',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialInstagram))), {}),
        color: '#8a3ab9',
        contrastText: 'white'
    },
    'youtube.com': {
        label: 'YouTube',
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialYouTube))), {}),
        color: '#FF0000',
        contrastText: 'white'
    }
};
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $732a429355ed7119$var$useStyles = (0, ($parcel$interopDefault($gJbUX$muistylesmakeStyles)))(()=>({
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
// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $732a429355ed7119$var$MultiUrlField = ({ source: source, domainMapping: domainMapping })=>{
    const newDomainMapping = {
        ...$732a429355ed7119$var$defaultdomainMapping,
        ...domainMapping
    };
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $gJbUX$reactadmin.useRecordContext)();
    const classes = $732a429355ed7119$var$useStyles();
    const urlArray = record[source] ? Array.isArray(record[source]) ? record[source] : [
        record[source]
    ] : [];
    return urlArray.map((url: any, index: any)=>{
        if (!url.startsWith('http')) url = `https://${url}`;
        let parsedUrl = null;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            return null;
        }
        const chip = newDomainMapping[parsedUrl.hostname] || {
            label: 'Site web',
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            icon: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($gJbUX$muiiconsmaterialLanguage))), {}),
            color: '#ea',
            contrastText: 'black'
        };
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)("a", {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: classes.link,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            children: /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.Chip), {
                component: "span",
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
var $732a429355ed7119$export$2e2bcd8739ae039 = $732a429355ed7119$var$MultiUrlField;






// useful to prevent click bubbling in a datagrid with rowClick
const $43c570e3fbe4d9a0$var$stopPropagation = (e: any) => e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $43c570e3fbe4d9a0$var$handleClick = ()=>{};
const $43c570e3fbe4d9a0$var$SeparatedListField = (props: any) => {
    let { children: children, link: link = 'edit', linkType: linkType, separator: separator = ',\u00A0' } = props;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, isLoading: isLoading, resource: resource } = (0, $gJbUX$reactadmin.useListContext)(props);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createPath = (0, $gJbUX$reactadmin.useCreatePath)();
    if (linkType !== undefined) {
        console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
        link = linkType;
    }
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    if (isLoading) return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$muimaterial.LinearProgress), {});
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactjsxruntime.Fragment), {
            children: data.map((record: any, i: any)=>{
                if (!record.id) return null;
                const resourceLinkPath = link !== false && (typeof link === 'function' ? link(record.id) : createPath({
                    resource: resource,
                    id: record.id,
                    type: link
                }));
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                if (resourceLinkPath) return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("span", {
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.Link), {
                            to: resourceLinkPath,
                            onClick: $43c570e3fbe4d9a0$var$stopPropagation,
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $gJbUX$react.cloneElement)((0, $gJbUX$react.Children).only(children), {
                                // Workaround to force ChipField to be clickable
                                onClick: $43c570e3fbe4d9a0$var$handleClick
                            })
                        }),
                        i < data.length - 1 && separator
                    ]
                }, record.id);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                return /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsxs)("span", {
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $gJbUX$reactjsxruntime.jsx)((0, $gJbUX$reactadmin.RecordContextProvider), {
                            value: record,
                            children: children
                        }),
                        i < data.length - 1 && separator
                    ]
                }, record.id);
            })
        })
    );
};
var $43c570e3fbe4d9a0$export$2e2bcd8739ae039 = $43c570e3fbe4d9a0$var$SeparatedListField;




//# sourceMappingURL=index.cjs.js.map
