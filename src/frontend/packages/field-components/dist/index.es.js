import {jsxs as $iSi6A$jsxs, jsx as $iSi6A$jsx, Fragment as $iSi6A$Fragment} from "react/jsx-runtime";
import $iSi6A$react, {useState as $iSi6A$useState, useMemo as $iSi6A$useMemo, useCallback as $iSi6A$useCallback, useEffect as $iSi6A$useEffect, cloneElement as $iSi6A$cloneElement, Children as $iSi6A$Children} from "react";
import {useRecordContext as $iSi6A$useRecordContext, RecordContextProvider as $iSi6A$RecordContextProvider, ReferenceArrayField as $iSi6A$ReferenceArrayField, ReferenceField as $iSi6A$ReferenceField, usePermissions as $iSi6A$usePermissions, useShowContext as $iSi6A$useShowContext, useDataProvider as $iSi6A$useDataProvider, useTranslate as $iSi6A$useTranslate, useRefresh as $iSi6A$useRefresh, useNotify as $iSi6A$useNotify, useGetResourceLabel as $iSi6A$useGetResourceLabel, Button as $iSi6A$Button, useCreatePath as $iSi6A$useCreatePath, useResourceDefinition as $iSi6A$useResourceDefinition, useListContext as $iSi6A$useListContext, Link as $iSi6A$Link} from "react-admin";
import {Box as $iSi6A$Box, Avatar as $iSi6A$Avatar, Chip as $iSi6A$Chip, Dialog as $iSi6A$Dialog, DialogTitle as $iSi6A$DialogTitle, DialogContent as $iSi6A$DialogContent, TextField as $iSi6A$TextField, DialogActions as $iSi6A$DialogActions, List as $iSi6A$List, ListItem as $iSi6A$ListItem, ListItemAvatar as $iSi6A$ListItemAvatar, ListItemText as $iSi6A$ListItemText, ListItemSecondaryAction as $iSi6A$ListItemSecondaryAction, IconButton as $iSi6A$IconButton, CircularProgress as $iSi6A$CircularProgress, LinearProgress as $iSi6A$LinearProgress} from "@mui/material";
import $iSi6A$muistylesmakeStyles from "@mui/styles/makeStyles";
import $iSi6A$muiiconsmaterialLaunch from "@mui/icons-material/Launch";
import {useForm as $iSi6A$useForm} from "react-hook-form";
import $iSi6A$muiiconsmaterialAdd from "@mui/icons-material/Add";
import {useDataModel as $iSi6A$useDataModel, useDataServers as $iSi6A$useDataServers} from "@semapps/semantic-data-provider";
import $iSi6A$lodashdebounce from "lodash.debounce";
import $iSi6A$muiiconsmaterialVisibility from "@mui/icons-material/Visibility";
import $iSi6A$muiiconsmaterialError from "@mui/icons-material/Error";
import $iSi6A$muiiconsmaterialLanguage from "@mui/icons-material/Language";
import $iSi6A$muiiconsmaterialFacebook from "@mui/icons-material/Facebook";
import $iSi6A$muiiconsmaterialGitHub from "@mui/icons-material/GitHub";
import $iSi6A$muiiconsmaterialTwitter from "@mui/icons-material/Twitter";
import $iSi6A$muiiconsmaterialInstagram from "@mui/icons-material/Instagram";
import $iSi6A$muiiconsmaterialYouTube from "@mui/icons-material/YouTube";
import {FiGitlab as $iSi6A$FiGitlab} from "react-icons/fi";







const $548fb3c4c04d834a$var$useStyles = (0, $iSi6A$muistylesmakeStyles)((theme)=>({
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
const $548fb3c4c04d834a$var$handleClick = ()=>{};
const $548fb3c4c04d834a$var$AvatarWithLabelField = ({ label: label, defaultLabel: defaultLabel, image: image, fallback: fallback, externalLink: externalLink, labelColor: labelColor, classes: classes, ...rest })=>{
    classes = $548fb3c4c04d834a$var$useStyles(classes);
    const record = (0, $iSi6A$useRecordContext)();
    const computedLabel = (typeof label === "function" ? label(record) : record[label]) || defaultLabel;
    const computedImage = typeof image === "function" ? image(record) : record[image];
    const computedFallback = typeof fallback === "function" ? fallback(record) : fallback;
    return /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$Box), {
        className: classes.parent,
        children: [
            /*#__PURE__*/ (0, $iSi6A$jsx)("div", {
                className: classes.square,
                children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Avatar), {
                    src: computedImage || computedFallback,
                    alt: computedLabel,
                    fallback: computedFallback,
                    ...rest,
                    className: classes.avatar
                })
            }),
            !computedLabel ? null : externalLink ? /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel,
                deleteIcon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialLaunch), {
                    className: classes.launchIcon
                }),
                onDelete: $548fb3c4c04d834a$var$handleClick
            }) : /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Chip), {
                color: labelColor,
                className: classes.chip,
                size: "small",
                label: computedLabel
            })
        ]
    });
};
$548fb3c4c04d834a$var$AvatarWithLabelField.defaultProps = {
    labelColor: "secondary",
    externalLink: false
};
var $548fb3c4c04d834a$export$2e2bcd8739ae039 = $548fb3c4c04d834a$var$AvatarWithLabelField;





const $867e5374e5f64b17$var$ReferenceArrayField = ({ source: source, ...otherProps })=>{
    const record = (0, $iSi6A$useRecordContext)();
    if (record?.[source]) {
        if (!Array.isArray(record[source])) record[source] = [
            record[source]
        ];
        record[source] = record[source].map((i)=>i["@id"] || i.id || i);
    }
    return /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ReferenceArrayField), {
            source: source,
            ...otherProps
        })
    });
};
var $867e5374e5f64b17$export$2e2bcd8739ae039 = $867e5374e5f64b17$var$ReferenceArrayField;





const $e253ae5050c248a7$var$ReferenceField = ({ source: source, ...otherProps })=>{
    const record = (0, $iSi6A$useRecordContext)();
    if (record[source]) {
        if (typeof record[source] === "object") record[source] = record[source]["@id"] || record[source].id;
    }
    return /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$RecordContextProvider), {
        value: record,
        children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ReferenceField), {
            record: record,
            source: source,
            ...otherProps
        })
    });
};
var $e253ae5050c248a7$export$2e2bcd8739ae039 = $e253ae5050c248a7$var$ReferenceField;
























const $6bf8168f746430d4$var$useStyles = (0, $iSi6A$muistylesmakeStyles)((theme)=>({
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
const $6bf8168f746430d4$var$getServerName = (resourceUri, dataServers)=>{
    const server = dataServers && Object.values(dataServers).find((server)=>resourceUri.startsWith(server.baseUrl));
    return server ? server.name : "Inconnu";
};
const $6bf8168f746430d4$var$ResultsList = ({ keyword: keyword, source: source, reference: reference, appendLink: appendLink, switchToCreate: switchToCreate })=>{
    const classes = $6bf8168f746430d4$var$useStyles();
    const [loading, setLoading] = (0, $iSi6A$useState)(false);
    const [loaded, setLoaded] = (0, $iSi6A$useState)(false);
    const [results, setResults] = (0, $iSi6A$useState)([]);
    const translate = (0, $iSi6A$useTranslate)();
    const dataProvider = (0, $iSi6A$useDataProvider)();
    const dataServers = (0, $iSi6A$useDataServers)();
    const record = (0, $iSi6A$useRecordContext)();
    const createPath = (0, $iSi6A$useCreatePath)();
    const referenceDefinition = (0, $iSi6A$useResourceDefinition)({
        resource: reference
    });
    const getResourceLabel = (0, $iSi6A$useGetResourceLabel)();
    const dataModel = (0, $iSi6A$useDataModel)(reference);
    if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title) throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
    const search = (0, $iSi6A$useMemo)(()=>(0, $iSi6A$lodashdebounce)((keyword)=>{
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
    (0, $iSi6A$useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$List), {
        dense: true,
        className: classes.root,
        children: [
            loaded && results.map((resource)=>/*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$ListItem), {
                    button: true,
                    onClick: ()=>appendLink(resource.id),
                    children: [
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Avatar), {
                                children: /*#__PURE__*/ (0, $iSi6A$react).createElement(referenceDefinition.icon)
                            })
                        }),
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemText), {
                            className: classes.primaryText,
                            primary: resource[dataModel.fieldsMapping.title]
                        }),
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemText), {
                            className: classes.secondaryText,
                            primary: $6bf8168f746430d4$var$getServerName(resource.id, dataServers)
                        }),
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemSecondaryAction), {
                            children: /*#__PURE__*/ (0, $iSi6A$jsx)("a", {
                                href: createPath({
                                    resource: reference,
                                    id: resource.id,
                                    type: "show"
                                }),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$IconButton), {
                                    edge: "end",
                                    size: "large",
                                    children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialVisibility), {})
                                })
                            })
                        })
                    ]
                }, resource.id)),
            loaded && results.length === 0 && /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$ListItem), {
                children: [
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Avatar), {
                            children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialError), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemText), {
                        className: classes.primaryText,
                        primary: translate("ra.navigation.no_results")
                    })
                ]
            }),
            loaded && referenceDefinition.hasCreate && /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$ListItem), {
                button: true,
                onClick: switchToCreate,
                children: [
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemAvatar), {
                        children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Avatar), {
                            children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialAdd), {})
                        })
                    }),
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$ListItemText), {
                        className: classes.primaryText,
                        primary: translate("ra.page.create", {
                            name: getResourceLabel(reference, 1)
                        })
                    })
                ]
            }),
            loading && /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Box), {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$CircularProgress), {
                    size: 60,
                    thickness: 6
                })
            })
        ]
    });
};
var $6bf8168f746430d4$export$2e2bcd8739ae039 = $6bf8168f746430d4$var$ResultsList;


const $3d5bffcd1289119f$var$useStyles = (0, $iSi6A$muistylesmakeStyles)(()=>({
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
const $3d5bffcd1289119f$var$QuickAppendDialog = ({ open: open, onClose: onClose, subjectUri: subjectUri, source: source, reference: reference })=>{
    const classes = $3d5bffcd1289119f$var$useStyles();
    const { resource: resource } = (0, $iSi6A$useShowContext)();
    const [keyword, setKeyword] = (0, $iSi6A$useState)("");
    const [panel, setPanel] = (0, $iSi6A$useState)("find");
    const dataProvider = (0, $iSi6A$useDataProvider)();
    const translate = (0, $iSi6A$useTranslate)();
    const refresh = (0, $iSi6A$useRefresh)();
    const notify = (0, $iSi6A$useNotify)();
    const getResourceLabel = (0, $iSi6A$useGetResourceLabel)();
    const dataModel = (0, $iSi6A$useDataModel)(reference);
    const { register: register, setValue: setValue, handleSubmit: handleSubmit } = (0, $iSi6A$useForm)();
    const appendLink = (0, $iSi6A$useCallback)(async (objectUri)=>{
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
    const create = (0, $iSi6A$useCallback)(async (values)=>{
        const { data: data } = await dataProvider.create(reference, {
            data: {
                [dataModel.fieldsMapping.title]: values.title
            }
        });
        await appendLink(data.id);
        notify(`La resource "${values.title}" a été créée`, {
            type: "success"
        });
    }, [
        dataProvider,
        dataModel,
        appendLink,
        reference,
        notify
    ]);
    return /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: panel === "find" ? /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$Fragment), {
            children: [
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogTitle), {
                    className: classes.title,
                    children: "Ajouter une relation"
                }),
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$TextField), {
                        autoFocus: true,
                        label: `Rechercher ou créer des ${getResourceLabel(reference, 2).toLowerCase()}`,
                        variant: "filled",
                        margin: "dense",
                        value: keyword,
                        onChange: (e)=>setKeyword(e.target.value),
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogContent), {
                    className: classes.listForm,
                    children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $6bf8168f746430d4$export$2e2bcd8739ae039), {
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
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogActions), {
                    className: classes.actions,
                    children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Button), {
                        label: "ra.action.close",
                        variant: "text",
                        onClick: onClose
                    })
                })
            ]
        }) : /*#__PURE__*/ (0, $iSi6A$jsxs)("form", {
            onSubmit: handleSubmit(create),
            children: [
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogTitle), {
                    className: classes.title,
                    children: translate("ra.page.create", {
                        name: getResourceLabel(reference, 1)
                    })
                }),
                /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$DialogContent), {
                    className: classes.addForm,
                    children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$TextField), {
                        ...register("title"),
                        autoFocus: true,
                        label: "Titre",
                        variant: "filled",
                        margin: "dense",
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$DialogActions), {
                    className: classes.actions,
                    children: [
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Button), {
                            label: "ra.action.create",
                            variant: "contained",
                            startIcon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialAdd), {}),
                            type: "submit"
                        }),
                        /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Button), {
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
var $3d5bffcd1289119f$export$2e2bcd8739ae039 = $3d5bffcd1289119f$var$QuickAppendDialog;


const $c6e9301cf3cc37bc$var$QuickAppendReferenceArrayField = ({ reference: reference, source: source, resource: resource, children: children, ...otherProps })=>{
    const record = (0, $iSi6A$useRecordContext)();
    const [showDialog, setShowDialog] = (0, $iSi6A$useState)(false);
    const { permissions: permissions } = (0, $iSi6A$usePermissions)(record.id);
    const canAppend = (0, $iSi6A$useMemo)(()=>!!permissions && permissions.some((p)=>[
                "acl:Append",
                "acl:Write",
                "acl:Control"
            ].includes(p["acl:mode"])), [
        permissions
    ]);
    return /*#__PURE__*/ (0, $iSi6A$jsxs)((0, $iSi6A$Fragment), {
        children: [
            /*#__PURE__*/ (0, $iSi6A$jsx)((0, $867e5374e5f64b17$export$2e2bcd8739ae039), {
                reference: reference,
                source: source,
                ...otherProps,
                children: (0, $iSi6A$react).Children.only(children) && /*#__PURE__*/ (0, $iSi6A$react).cloneElement(children, {
                    appendLink: canAppend ? ()=>setShowDialog(true) : undefined
                })
            }),
            canAppend && showDialog && /*#__PURE__*/ (0, $iSi6A$jsx)((0, $3d5bffcd1289119f$export$2e2bcd8739ae039), {
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
var $c6e9301cf3cc37bc$export$2e2bcd8739ae039 = $c6e9301cf3cc37bc$var$QuickAppendReferenceArrayField;














const $3964a2ca9e598444$var$defaultdomainMapping = {
    "github.com": {
        label: "GitHub",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialGitHub), {}),
        color: "black",
        contrastText: "white"
    },
    "gitlab.com": {
        label: "GitLab",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$FiGitlab), {}),
        color: "orange",
        contrastText: "black"
    },
    "opencollective.com": {
        label: "Open Collective",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Avatar), {
            component: "span",
            src: "https://opencollective.com/static/images/opencollective-icon.svg"
        }),
        color: "white",
        contrastText: "#297EFF"
    },
    "facebook.com": {
        label: "Facebook",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialFacebook), {}),
        color: "#4267B2",
        contrastText: "white"
    },
    "twitter.com": {
        label: "Twitter",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialTwitter), {}),
        color: "#00ACEE",
        contrastText: "white"
    },
    "instagram.com": {
        label: "Instagram",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialInstagram), {}),
        color: "#8a3ab9",
        contrastText: "white"
    },
    "youtube.com": {
        label: "YouTube",
        icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialYouTube), {}),
        color: "#FF0000",
        contrastText: "white"
    }
};
const $3964a2ca9e598444$var$useStyles = (0, $iSi6A$muistylesmakeStyles)(()=>({
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
const $3964a2ca9e598444$var$MultiUrlField = ({ source: source, domainMapping: domainMapping })=>{
    const newDomainMapping = {
        ...$3964a2ca9e598444$var$defaultdomainMapping,
        ...domainMapping
    };
    const record = (0, $iSi6A$useRecordContext)();
    const classes = $3964a2ca9e598444$var$useStyles();
    const urlArray = record[source] ? Array.isArray(record[source]) ? record[source] : [
        record[source]
    ] : [];
    return urlArray.map((url, index)=>{
        if (!url.startsWith("http")) url = `https://${url}`;
        const parsedUrl = new URL(url);
        if (!parsedUrl) return null;
        const chip = newDomainMapping[parsedUrl.hostname] || {
            label: "Site web",
            icon: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$muiiconsmaterialLanguage), {}),
            color: "#ea",
            contrastText: "black"
        };
        return /*#__PURE__*/ (0, $iSi6A$jsx)("a", {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: classes.link,
            children: /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Chip), {
                component: "span",
                icon: /*#__PURE__*/ (0, $iSi6A$react).cloneElement(chip.icon, {
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
var $3964a2ca9e598444$export$2e2bcd8739ae039 = $3964a2ca9e598444$var$MultiUrlField;






// useful to prevent click bubbling in a datagrid with rowClick
const $ae119a539bc2f2b9$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $ae119a539bc2f2b9$var$handleClick = ()=>{};
const $ae119a539bc2f2b9$var$SeparatedListField = (props)=>{
    let { children: children, link: link = "edit", linkType: linkType, separator: separator = ",\xa0" } = props;
    const { data: data, isLoading: isLoading, resource: resource } = (0, $iSi6A$useListContext)(props);
    const createPath = (0, $iSi6A$useCreatePath)();
    if (linkType !== undefined) {
        console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
        link = linkType;
    }
    if (isLoading) return /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$LinearProgress), {});
    return /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Fragment), {
        children: data.map((record, i)=>{
            if (!record.id) return null;
            const resourceLinkPath = link !== false && (typeof link === "function" ? link(record.id) : createPath({
                resource: resource,
                id: record.id,
                type: link
            }));
            if (resourceLinkPath) return /*#__PURE__*/ (0, $iSi6A$jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$Link), {
                        to: resourceLinkPath,
                        onClick: $ae119a539bc2f2b9$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $iSi6A$cloneElement)((0, $iSi6A$Children).only(children), {
                            // Workaround to force ChipField to be clickable
                            onClick: $ae119a539bc2f2b9$var$handleClick
                        })
                    }),
                    i < data.length - 1 && separator
                ]
            }, record.id);
            return /*#__PURE__*/ (0, $iSi6A$jsxs)("span", {
                children: [
                    /*#__PURE__*/ (0, $iSi6A$jsx)((0, $iSi6A$RecordContextProvider), {
                        value: record,
                        children: children
                    }),
                    i < data.length - 1 && separator
                ]
            }, record.id);
        })
    });
};
var $ae119a539bc2f2b9$export$2e2bcd8739ae039 = $ae119a539bc2f2b9$var$SeparatedListField;




export {$548fb3c4c04d834a$export$2e2bcd8739ae039 as AvatarWithLabelField, $867e5374e5f64b17$export$2e2bcd8739ae039 as ReferenceArrayField, $e253ae5050c248a7$export$2e2bcd8739ae039 as ReferenceField, $c6e9301cf3cc37bc$export$2e2bcd8739ae039 as QuickAppendReferenceArrayField, $3964a2ca9e598444$export$2e2bcd8739ae039 as MultiUrlField, $ae119a539bc2f2b9$export$2e2bcd8739ae039 as SeparatedListField};
//# sourceMappingURL=index.es.js.map
