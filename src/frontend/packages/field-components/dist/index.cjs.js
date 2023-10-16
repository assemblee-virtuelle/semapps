var $drrcw$reactjsxruntime = require("react/jsx-runtime");
var $drrcw$react = require("react");
var $drrcw$reactadmin = require("react-admin");
var $drrcw$muimaterial = require("@mui/material");
var $drrcw$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $drrcw$muiiconsmaterialLaunch = require("@mui/icons-material/Launch");
var $drrcw$reacthookform = require("react-hook-form");
var $drrcw$muiiconsmaterialAdd = require("@mui/icons-material/Add");
var $drrcw$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $drrcw$lodashdebounce = require("lodash.debounce");
var $drrcw$muiiconsmaterialVisibility = require("@mui/icons-material/Visibility");
var $drrcw$muiiconsmaterialError = require("@mui/icons-material/Error");
var $drrcw$muiiconsmaterialLanguage = require("@mui/icons-material/Language");
var $drrcw$muiiconsmaterialFacebook = require("@mui/icons-material/Facebook");
var $drrcw$muiiconsmaterialGitHub = require("@mui/icons-material/GitHub");
var $drrcw$muiiconsmaterialTwitter = require("@mui/icons-material/Twitter");
var $drrcw$muiiconsmaterialInstagram = require("@mui/icons-material/Instagram");
var $drrcw$muiiconsmaterialYouTube = require("@mui/icons-material/YouTube");
var $drrcw$reacticonsfi = require("react-icons/fi");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "AvatarWithLabelField", () => $4e17293ac0574285$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceArrayField", () => $b6ed9e2776cb4ba3$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceField", () => $387e8196d8654c58$export$2e2bcd8739ae039);
$parcel$export(module.exports, "QuickAppendReferenceArrayField", () => $6a1cce6d258bf615$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiUrlField", () => $732a429355ed7119$export$2e2bcd8739ae039);
$parcel$export(module.exports, "SeparatedListField", () => $43c570e3fbe4d9a0$export$2e2bcd8739ae039);






const $4e17293ac0574285$var$useStyles = (0, ($parcel$interopDefault($drrcw$muistylesmakeStyles)))((theme)=>({
        parent: (props)=>({
                position: "relative",
                ...props.parent
            }),
        square: {
            width: "100%",
            paddingBottom: "100%",
            position: "relative"
        },
        avatar: {
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            // backgroundColor: theme.palette.primary.main,
            "& svg": {
                width: "55%",
                height: "55%"
            }
        },
        chip: {
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 6,
            paddingRight: 6,
            marginBottom: 10,
            cursor: "pointer"
        },
        launchIcon: {
            width: 14
        }
    }));
const $4e17293ac0574285$var$handleClick = ()=>{};
const $4e17293ac0574285$var$AvatarWithLabelField = ({ label: label, defaultLabel: defaultLabel, image: image, fallback: fallback, externalLink: externalLink, labelColor: labelColor, classes: classes, ...rest })=>{
    classes = $4e17293ac0574285$var$useStyles(classes);
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    const computedLabel = (typeof label === "function" ? label(record) : record[label]) || defaultLabel;
    const computedImage = typeof image === "function" ? image(record) : record[image];
    const computedFallback = typeof fallback === "function" ? fallback(record) : fallback;
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.Box), {
        className: classes.parent,
        children: [
            /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)("div", {
                className: classes.square,
                children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Avatar), {
                    src: computedImage || computedFallback,
                    alt: computedLabel,
                    fallback: computedFallback,
                    ...rest,
                    className: classes.avatar
                })
            }),
            !computedLabel ? null : externalLink ? /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel,
                deleteIcon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialLaunch))), {
                    className: classes.launchIcon
                }),
                onDelete: $4e17293ac0574285$var$handleClick
            }) : /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel
            })
        ]
    });
};
$4e17293ac0574285$var$AvatarWithLabelField.defaultProps = {
    labelColor: "secondary",
    externalLink: false
};
var $4e17293ac0574285$export$2e2bcd8739ae039 = $4e17293ac0574285$var$AvatarWithLabelField;





const $b6ed9e2776cb4ba3$var$ReferenceArrayField = ({ source: source, ...otherProps })=>{
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    if (record?.[source]) {
        if (!Array.isArray(record[source])) record[source] = [
            record[source]
        ];
        record[source] = record[source].map((i)=>i["@id"] || i.id || i);
    }
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.ReferenceArrayField), {
            source: source,
            ...otherProps
        })
    });
};
var $b6ed9e2776cb4ba3$export$2e2bcd8739ae039 = $b6ed9e2776cb4ba3$var$ReferenceArrayField;





const $387e8196d8654c58$var$ReferenceField = ({ source: source, ...otherProps })=>{
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    if (record[source]) {
        if (typeof record[source] === "object") record[source] = record[source]["@id"] || record[source].id;
    }
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.ReferenceField), {
            record: record,
            source: source,
            ...otherProps
        })
    });
};
var $387e8196d8654c58$export$2e2bcd8739ae039 = $387e8196d8654c58$var$ReferenceField;
























const $c7e6f337903f861b$var$useStyles = (0, ($parcel$interopDefault($drrcw$muistylesmakeStyles)))((theme)=>({
        root: {
            width: "100%",
            maxWidth: "100%",
            backgroundColor: theme.palette.background.paper,
            paddingTop: 0,
            paddingBottom: 0
        },
        primaryText: {
            width: "30%"
        },
        secondaryText: {
            fontStyle: "italic",
            color: "grey"
        }
    }));
const $c7e6f337903f861b$var$getServerName = (resourceUri, dataServers)=>{
    const server = dataServers && Object.values(dataServers).find((server)=>resourceUri.startsWith(server.baseUrl));
    return server ? server.name : "Inconnu";
};
const $c7e6f337903f861b$var$ResultsList = ({ keyword: keyword, source: source, reference: reference, appendLink: appendLink, switchToCreate: switchToCreate })=>{
    const classes = $c7e6f337903f861b$var$useStyles();
    const [loading, setLoading] = (0, $drrcw$react.useState)(false);
    const [loaded, setLoaded] = (0, $drrcw$react.useState)(false);
    const [results, setResults] = (0, $drrcw$react.useState)([]);
    const translate = (0, $drrcw$reactadmin.useTranslate)();
    const dataProvider = (0, $drrcw$reactadmin.useDataProvider)();
    const dataServers = (0, $drrcw$semappssemanticdataprovider.useDataServers)();
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    const createPath = (0, $drrcw$reactadmin.useCreatePath)();
    const referenceDefinition = (0, $drrcw$reactadmin.useResourceDefinition)({
        resource: reference
    });
    const getResourceLabel = (0, $drrcw$reactadmin.useGetResourceLabel)();
    const dataModel = (0, $drrcw$semappssemanticdataprovider.useDataModel)(reference);
    if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title) throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
    const search = (0, $drrcw$react.useMemo)(()=>(0, ($parcel$interopDefault($drrcw$lodashdebounce)))((keyword)=>{
            dataProvider.getList(reference, {
                pagination: {
                    page: 1,
                    perPage: 100
                },
                sort: {
                    field: dataModel?.fieldsMapping?.title,
                    order: "ASC"
                },
                filter: {
                    q: keyword,
                    _predicates: [
                        dataModel.fieldsMapping.title
                    ],
                    _servers: "@all"
                }
            }).then(({ data: data })=>{
                const existingLinks = record[source] ? Array.isArray(record[source]) ? record[source] : [
                    record[source]
                ] : [];
                const newLinks = data.filter((record)=>!existingLinks.includes(record.id));
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
    (0, $drrcw$react.useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.List), {
        dense: true,
        className: classes.root,
        children: [
            loaded && results.map((resource)=>/*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.ListItem), {
                    button: true,
                    onClick: ()=>appendLink(resource.id),
                    children: [
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Avatar), {
                                children: /*#__PURE__*/ (0, ($parcel$interopDefault($drrcw$react))).createElement(referenceDefinition.icon)
                            })
                        }),
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemText), {
                            className: classes.primaryText,
                            primary: resource[dataModel.fieldsMapping.title]
                        }),
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemText), {
                            className: classes.secondaryText,
                            primary: $c7e6f337903f861b$var$getServerName(resource.id, dataServers)
                        }),
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemSecondaryAction), {
                            children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)("a", {
                                href: createPath({
                                    resource: reference,
                                    id: resource.id,
                                    type: "show"
                                }),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.IconButton), {
                                    edge: "end",
                                    size: "large",
                                    children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialVisibility))), {})
                                })
                            })
                        })
                    ]
                }, resource.id)),
            loaded && results.length === 0 && /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.ListItem), {
                children: [
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Avatar), {
                            children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialError))), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemText), {
                        className: classes.primaryText,
                        primary: translate("ra.navigation.no_results")
                    })
                ]
            }),
            loaded && referenceDefinition.hasCreate && /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.ListItem), {
                button: true,
                onClick: switchToCreate,
                children: [
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Avatar), {
                            children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialAdd))), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.ListItemText), {
                        className: classes.primaryText,
                        primary: translate("ra.page.create", {
                            name: getResourceLabel(reference, 1)
                        })
                    })
                ]
            }),
            loading && /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Box), {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.CircularProgress), {
                    size: 60,
                    thickness: 6
                })
            })
        ]
    });
};
var $c7e6f337903f861b$export$2e2bcd8739ae039 = $c7e6f337903f861b$var$ResultsList;


const $9ac0ba4780250906$var$useStyles = (0, ($parcel$interopDefault($drrcw$muistylesmakeStyles)))(()=>({
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
const $9ac0ba4780250906$var$QuickAppendDialog = ({ open: open, onClose: onClose, subjectUri: subjectUri, source: source, reference: reference })=>{
    const classes = $9ac0ba4780250906$var$useStyles();
    const { resource: resource } = (0, $drrcw$reactadmin.useShowContext)();
    const [keyword, setKeyword] = (0, $drrcw$react.useState)("");
    const [panel, setPanel] = (0, $drrcw$react.useState)("find");
    const dataProvider = (0, $drrcw$reactadmin.useDataProvider)();
    const translate = (0, $drrcw$reactadmin.useTranslate)();
    const refresh = (0, $drrcw$reactadmin.useRefresh)();
    const notify = (0, $drrcw$reactadmin.useNotify)();
    const getResourceLabel = (0, $drrcw$reactadmin.useGetResourceLabel)();
    const dataModel = (0, $drrcw$semappssemanticdataprovider.useDataModel)(reference);
    const { register: register, setValue: setValue, handleSubmit: handleSubmit } = (0, $drrcw$reacthookform.useForm)();
    const appendLink = (0, $drrcw$react.useCallback)(async (objectUri)=>{
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
    const create = (0, $drrcw$react.useCallback)(async (values)=>{
        const { data: data } = await dataProvider.create(reference, {
            data: {
                [dataModel.fieldsMapping.title]: values.title
            }
        });
        await appendLink(data.id);
        notify(`La resource "${values.title}" a \xe9t\xe9 cr\xe9\xe9e`, {
            type: "success"
        });
    }, [
        dataProvider,
        dataModel,
        appendLink,
        reference,
        notify
    ]);
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: panel === "find" ? /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$reactjsxruntime.Fragment), {
            children: [
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogTitle), {
                    className: classes.title,
                    children: "Ajouter une relation"
                }),
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.TextField), {
                        autoFocus: true,
                        label: `Rechercher ou cr\xe9er des ${getResourceLabel(reference, 2).toLowerCase()}`,
                        variant: "filled",
                        margin: "dense",
                        value: keyword,
                        onChange: (e)=>setKeyword(e.target.value),
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogContent), {
                    className: classes.listForm,
                    children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $c7e6f337903f861b$export$2e2bcd8739ae039), {
                        keyword: keyword,
                        source: source,
                        reference: reference,
                        appendLink: appendLink,
                        switchToCreate: ()=>{
                            setValue("title", keyword);
                            setPanel("create");
                        }
                    })
                }),
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogActions), {
                    className: classes.actions,
                    children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.Button), {
                        label: "ra.action.close",
                        variant: "text",
                        onClick: onClose
                    })
                })
            ]
        }) : /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)("form", {
            onSubmit: handleSubmit(create),
            children: [
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogTitle), {
                    className: classes.title,
                    children: translate("ra.page.create", {
                        name: getResourceLabel(reference, 1)
                    })
                }),
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.TextField), {
                        ...register("title"),
                        autoFocus: true,
                        label: "Titre",
                        variant: "filled",
                        margin: "dense",
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$muimaterial.DialogActions), {
                    className: classes.actions,
                    children: [
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.Button), {
                            label: "ra.action.create",
                            variant: "contained",
                            startIcon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialAdd))), {}),
                            type: "submit"
                        }),
                        /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.Button), {
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
var $9ac0ba4780250906$export$2e2bcd8739ae039 = $9ac0ba4780250906$var$QuickAppendDialog;


const $6a1cce6d258bf615$var$QuickAppendReferenceArrayField = ({ reference: reference, source: source, resource: resource, children: children, ...otherProps })=>{
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    const [showDialog, setShowDialog] = (0, $drrcw$react.useState)(false);
    const { permissions: permissions } = (0, $drrcw$reactadmin.usePermissions)(record.id);
    const canAppend = (0, $drrcw$react.useMemo)(()=>!!permissions && permissions.some((p)=>[
                "acl:Append",
                "acl:Write",
                "acl:Control"
            ].includes(p["acl:mode"])), [
        permissions
    ]);
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)((0, $drrcw$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $b6ed9e2776cb4ba3$export$2e2bcd8739ae039), {
                reference: reference,
                source: source,
                ...otherProps,
                children: (0, ($parcel$interopDefault($drrcw$react))).Children.only(children) && /*#__PURE__*/ (0, ($parcel$interopDefault($drrcw$react))).cloneElement(children, {
                    appendLink: canAppend ? ()=>setShowDialog(true) : undefined
                })
            }),
            canAppend && showDialog && /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $9ac0ba4780250906$export$2e2bcd8739ae039), {
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
    "github.com": {
        label: "GitHub",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialGitHub))), {}),
        color: "black",
        contrastText: "white"
    },
    "gitlab.com": {
        label: "GitLab",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reacticonsfi.FiGitlab), {}),
        color: "orange",
        contrastText: "black"
    },
    "opencollective.com": {
        label: "Open Collective",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Avatar), {
            component: "span",
            src: "https://opencollective.com/static/images/opencollective-icon.svg"
        }),
        color: "white",
        contrastText: "#297EFF"
    },
    "facebook.com": {
        label: "Facebook",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialFacebook))), {}),
        color: "#4267B2",
        contrastText: "white"
    },
    "twitter.com": {
        label: "Twitter",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialTwitter))), {}),
        color: "#00ACEE",
        contrastText: "white"
    },
    "instagram.com": {
        label: "Instagram",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialInstagram))), {}),
        color: "#8a3ab9",
        contrastText: "white"
    },
    "youtube.com": {
        label: "YouTube",
        icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialYouTube))), {}),
        color: "#FF0000",
        contrastText: "white"
    }
};
const $732a429355ed7119$var$useStyles = (0, ($parcel$interopDefault($drrcw$muistylesmakeStyles)))(()=>({
        link: {
            textDecoration: "unset",
            "& :hover": {
                cursor: "pointer"
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
const $732a429355ed7119$var$MultiUrlField = ({ source: source, domainMapping: domainMapping })=>{
    const newDomainMapping = {
        ...$732a429355ed7119$var$defaultdomainMapping,
        ...domainMapping
    };
    const record = (0, $drrcw$reactadmin.useRecordContext)();
    const classes = $732a429355ed7119$var$useStyles();
    const urlArray = record[source] ? Array.isArray(record[source]) ? record[source] : [
        record[source]
    ] : [];
    return urlArray.map((url, index)=>{
        if (!url.startsWith("http")) url = `https://${url}`;
        const parsedUrl = new URL(url);
        if (!parsedUrl) return null;
        const chip = newDomainMapping[parsedUrl.hostname] || {
            label: "Site web",
            icon: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, ($parcel$interopDefault($drrcw$muiiconsmaterialLanguage))), {}),
            color: "#ea",
            contrastText: "black"
        };
        return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)("a", {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: classes.link,
            children: /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.Chip), {
                component: "span",
                icon: /*#__PURE__*/ (0, ($parcel$interopDefault($drrcw$react))).cloneElement(chip.icon, {
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
const $43c570e3fbe4d9a0$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $43c570e3fbe4d9a0$var$handleClick = ()=>{};
const $43c570e3fbe4d9a0$var$SeparatedListField = (props)=>{
    let { children: children, link: link = "edit", linkType: linkType, separator: separator = ",\xa0" } = props;
    const { data: data, isLoading: isLoading, resource: resource } = (0, $drrcw$reactadmin.useListContext)(props);
    const createPath = (0, $drrcw$reactadmin.useCreatePath)();
    if (linkType !== undefined) {
        console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
        link = linkType;
    }
    if (isLoading) return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$muimaterial.LinearProgress), {});
    return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactjsxruntime.Fragment), {
        children: data.map((record, i)=>{
            if (!record.id) return null;
            const resourceLinkPath = link !== false && (typeof link === "function" ? link(record.id) : createPath({
                resource: resource,
                id: record.id,
                type: link
            }));
            if (resourceLinkPath) return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.Link), {
                        to: resourceLinkPath,
                        onClick: $43c570e3fbe4d9a0$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $drrcw$react.cloneElement)((0, $drrcw$react.Children).only(children), {
                            // Workaround to force ChipField to be clickable
                            onClick: $43c570e3fbe4d9a0$var$handleClick
                        })
                    }),
                    i < data.length - 1 && separator
                ]
            }, record.id);
            return /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $drrcw$reactjsxruntime.jsx)((0, $drrcw$reactadmin.RecordContextProvider), {
                        value: record,
                        children: children
                    }),
                    i < data.length - 1 && separator
                ]
            }, record.id);
        })
    });
};
var $43c570e3fbe4d9a0$export$2e2bcd8739ae039 = $43c570e3fbe4d9a0$var$SeparatedListField;




//# sourceMappingURL=index.cjs.js.map
