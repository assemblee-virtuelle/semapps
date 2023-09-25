var $91PtX$reactjsxruntime = require("react/jsx-runtime");
var $91PtX$react = require("react");
var $91PtX$reactadmin = require("react-admin");
var $91PtX$muimaterial = require("@mui/material");
var $91PtX$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $91PtX$muimaterialAutocomplete = require("@mui/material/Autocomplete");
var $91PtX$muiiconsmaterialLanguage = require("@mui/icons-material/Language");
var $91PtX$muiiconsmaterialAdd = require("@mui/icons-material/Add");
var $91PtX$autosuggesthighlightmatch = require("autosuggest-highlight/match");
var $91PtX$autosuggesthighlightparse = require("autosuggest-highlight/parse");
var $91PtX$lodashthrottle = require("lodash.throttle");
var $91PtX$reacthookform = require("react-hook-form");
var $91PtX$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $91PtX$semappsinputcomponents = require("@semapps/input-components");
var $91PtX$urljoin = require("url-join");
var $91PtX$muiiconsmaterialStarBorder = require("@mui/icons-material/StarBorder");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "LexiconCreateDialog", () => $af88cd35a927a884$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CreateOrImportForm", () => $fb5291a8e3f7cfea$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ImportForm", () => $eaef283c22eb901e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LexiconImportForm", () => $80075ef971c3d1de$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LexiconAutocompleteInput", () => $3a4b4c603fe6b68b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchWikidata", () => $32077f9119e727a8$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchESCO", () => $17a31747492cb646$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useFork", () => $3722be33fafb3622$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useSync", () => $c0bd6c85f68e28e0$export$2e2bcd8739ae039);
// Dialogs















const $3a4b4c603fe6b68b$var$useStyles = (0, ($parcel$interopDefault($91PtX$muistylesmakeStyles)))((theme)=>({
        icon: {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(2)
        }
    }));
const $3a4b4c603fe6b68b$var$selectOptionText = (option, optionText)=>{
    if (typeof option === "string") return option;
    if (option.label) return option.label;
    if (typeof optionText === "string") return option[optionText];
    if (typeof optionText === "function") return optionText(option);
};
const $3a4b4c603fe6b68b$var$capitalizeFirstLetter = (string)=>string && string.charAt(0).toUpperCase() + string.slice(1);
const $3a4b4c603fe6b68b$var$LexiconAutocompleteInput = /*#__PURE__*/ (0, $91PtX$react.forwardRef)(({ fetchLexicon: fetchLexicon, source: source, defaultValue: defaultValue, label: label, parse: parse, optionText: optionText, helperText: helperText, ...rest }, ref)=>{
    const resource = (0, $91PtX$reactadmin.useResourceContext)();
    const classes = $3a4b4c603fe6b68b$var$useStyles();
    const locale = (0, $91PtX$reactadmin.useLocale)();
    const translate = (0, $91PtX$reactadmin.useTranslate)();
    const notify = (0, $91PtX$reactadmin.useNotify)();
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const { field: { value: value, onChange: onChange, onBlur: onBlur }, fieldState: { isTouched: isTouched, error: error }, formState: { submitError: submitError }, isRequired: isRequired } = (0, $91PtX$reactadmin.useInput)({
        source: source,
        defaultValue: defaultValue,
        ...rest
    });
    const [keyword, setKeyword] = (0, $91PtX$react.useState)(defaultValue); // Typed keywords
    const [options, setOptions] = (0, $91PtX$react.useState)([]); // Options returned by MapBox
    const throttledFetchLexicon = (0, $91PtX$react.useMemo)(()=>(0, ($parcel$interopDefault($91PtX$lodashthrottle)))((keyword, callback)=>{
            fetchLexicon({
                keyword: keyword,
                locale: locale
            }).then((data)=>callback(data)).catch((e)=>notify(e.message, {
                    type: "error"
                }));
        }, 200), [
        locale,
        fetchLexicon,
        notify
    ]);
    (0, $91PtX$react.useEffect)(()=>{
        // Do not trigger search if text input is empty
        if (!keyword) return undefined;
        throttledFetchLexicon(keyword, (results)=>setOptions(results));
    }, [
        value,
        keyword,
        throttledFetchLexicon
    ]);
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, ($parcel$interopDefault($91PtX$muimaterialAutocomplete))), {
        fullWidth: true,
        freeSolo: true,
        autoComplete: true,
        value: value || null,
        ref: ref,
        openOnFocus: !!defaultValue,
        // We must include the current value as an option, to avoid this error
        // https://github.com/mui-org/material-ui/issues/18514#issuecomment-636096386
        options: value ? [
            value,
            ...options
        ] : options,
        // Do not show the current value as an option (this would break renderOptions)
        filterSelectedOptions: true,
        // For some reasons, this prop has to be passed
        filterOptions: (options, params)=>{
            // Suggest the creation of a new value
            if (keyword) options.push({
                label: $3a4b4c603fe6b68b$var$capitalizeFirstLetter(keyword),
                summary: `Ajouter "${$3a4b4c603fe6b68b$var$capitalizeFirstLetter(keyword)}" au dictionnaire`,
                icon: (0, ($parcel$interopDefault($91PtX$muiiconsmaterialAdd)))
            });
            return options;
        },
        clearOnBlur: true,
        selectOnFocus: true,
        handleHomeEndKeys: true,
        getOptionLabel: (option)=>$3a4b4c603fe6b68b$var$selectOptionText(option, optionText),
        isOptionEqualToValue: (option, value)=>$3a4b4c603fe6b68b$var$selectOptionText(option, optionText) === $3a4b4c603fe6b68b$var$selectOptionText(value, optionText),
        // This function is called when the user selects an option
        onChange: (event, newValue)=>{
            // Parse only if the value is not null (happens if the user clears the value)
            if (newValue && parse) newValue = parse(newValue);
            onChange(newValue);
            setOptions([]);
        },
        onInputChange: (event, newKeyword)=>setKeyword(newKeyword),
        noOptionsText: translate("ra.navigation.no_results"),
        renderInput: (params)=>{
            // Autocomplete=off doesn't work anymore in modern browsers
            // https://stackoverflow.com/a/40791726/7900695
            params.inputProps.autoComplete = "new-password";
            return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.TextField), {
                ...params,
                autoFocus: true,
                inputProps: {
                    ...params.inputProps,
                    onBlur: (e)=>{
                        onBlur(e);
                        if (params.inputProps.onBlur) params.inputProps.onBlur(e);
                    },
                    onFocus: (e)=>{
                        if (params.inputProps.onFocus) params.inputProps.onFocus(e);
                    }
                },
                label: label !== "" && label !== false && /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.FieldTitle), {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }),
                error: !!(isTouched && (error || submitError)),
                helperText: /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.InputHelperText), {
                    touched: isTouched,
                    error: error || submitError,
                    helperText: helperText
                })
            });
        },
        renderOption: (props, option)=>{
            const matches = (0, ($parcel$interopDefault($91PtX$autosuggesthighlightmatch)))(option.label, keyword);
            const parts = (0, ($parcel$interopDefault($91PtX$autosuggesthighlightparse)))(option.label, matches);
            return /*#__PURE__*/ (0, $91PtX$react.createElement)((0, $91PtX$muimaterial.Grid), {
                container: true,
                alignItems: "center",
                ...props,
                key: option.uri || "create",
                children: [
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Grid), {
                        item: true,
                        children: /*#__PURE__*/ (0, ($parcel$interopDefault($91PtX$react))).createElement(option.icon || (0, ($parcel$interopDefault($91PtX$muiiconsmaterialLanguage))), {
                            className: classes.icon
                        })
                    }),
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$muimaterial.Grid), {
                        item: true,
                        xs: true,
                        children: [
                            typeof parts === "string" ? parts : parts.map((part, index)=>/*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)("span", {
                                    style: {
                                        fontWeight: part.highlight ? 700 : 400
                                    },
                                    children: part.text
                                }, index)),
                            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Typography), {
                                variant: "body2",
                                color: "textSecondary",
                                children: option.summary
                            })
                        ]
                    })
                ]
            });
        }
    });
});
$3a4b4c603fe6b68b$var$LexiconAutocompleteInput.defaultProps = {
    optionText: "label"
};
var $3a4b4c603fe6b68b$export$2e2bcd8739ae039 = $3a4b4c603fe6b68b$var$LexiconAutocompleteInput;


const $af88cd35a927a884$var$LexiconCreateDialog = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { filter: filter, onCancel: onCancel, onCreate: onCreate } = (0, $91PtX$reactadmin.useCreateSuggestionContext)();
    const resource = (0, $91PtX$reactadmin.useResourceContext)();
    const [value, setValue] = (0, $91PtX$react.useState)(filter || "");
    const [create] = (0, $91PtX$reactadmin.useCreate)();
    const onClose = (0, $91PtX$react.useCallback)(()=>{
        setValue("");
        onCancel();
    }, [
        setValue,
        onCancel
    ]);
    const onSubmit = (0, $91PtX$react.useCallback)(()=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        if (!value.uri) delete value.summary;
        create(resource, {
            data: selectData(value)
        }, {
            onSuccess: (data)=>{
                console.log("onSuccess", data);
                setValue("");
                onCreate(data);
            }
        });
    }, [
        create,
        onCreate,
        selectData,
        value,
        setValue,
        resource
    ]);
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$muimaterial.Dialog), {
        open: true,
        onClose: onClose,
        fullWidth: true,
        maxWidth: "sm",
        children: [
            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.DialogContent), {
                children: /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $3a4b4c603fe6b68b$export$2e2bcd8739ae039), {
                    source: "lexicon",
                    label: "Titre",
                    fetchLexicon: fetchLexicon,
                    defaultValue: filter,
                    value: value,
                    onChange: setValue
                })
            }),
            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$muimaterial.DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Button), {
                        onClick: onClose,
                        children: "Annuler"
                    }),
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Button), {
                        variant: "contained",
                        color: "primary",
                        onClick: onSubmit,
                        children: "Ajouter"
                    })
                ]
            })
        ]
    });
};
var $af88cd35a927a884$export$2e2bcd8739ae039 = $af88cd35a927a884$var$LexiconCreateDialog;















const $3722be33fafb3622$var$useFork = (resourceId)=>{
    const dataProvider = (0, $91PtX$reactadmin.useDataProvider)();
    const redirect = (0, $91PtX$reactadmin.useRedirect)();
    const notify = (0, $91PtX$reactadmin.useNotify)();
    return (0, $91PtX$react.useCallback)(async (remoteRecordUri, stripProperties = [])=>{
        const { data: remoteData } = await dataProvider.getOne(resourceId, {
            id: remoteRecordUri
        });
        const strippedData = {
            ...remoteData
        };
        strippedData["http://www.w3.org/ns/prov#wasDerivedFrom"] = strippedData.id;
        delete strippedData.id;
        delete strippedData["@context"];
        stripProperties.forEach((prop)=>{
            delete strippedData[prop];
        });
        const { data: localData } = await dataProvider.create(resourceId, {
            data: strippedData
        });
        redirect(`/${resourceId}/${encodeURIComponent(localData.id)}/show`);
        notify("La ressource a bien \xe9t\xe9 copi\xe9e", {
            type: "success"
        });
    }, [
        resourceId,
        dataProvider,
        redirect,
        notify
    ]);
};
var $3722be33fafb3622$export$2e2bcd8739ae039 = $3722be33fafb3622$var$useFork;




const $c0bd6c85f68e28e0$var$useSync = (resourceId)=>{
    const dataProvider = (0, $91PtX$reactadmin.useDataProvider)();
    const notify = (0, $91PtX$reactadmin.useNotify)();
    const redirect = (0, $91PtX$reactadmin.useRedirect)();
    return (0, $91PtX$react.useCallback)(async (remoteRecordUri)=>{
        await dataProvider.create(resourceId, {
            id: remoteRecordUri
        });
        redirect(`/${resourceId}/${encodeURIComponent(remoteRecordUri)}/show`);
        notify("La ressource a bien \xe9t\xe9 import\xe9e", {
            type: "success"
        });
    }, [
        dataProvider,
        redirect,
        notify
    ]);
};
var $c0bd6c85f68e28e0$export$2e2bcd8739ae039 = $c0bd6c85f68e28e0$var$useSync;


const $eaef283c22eb901e$var$ImportFormInputs = ()=>{
    const resource = (0, $91PtX$reactadmin.useResourceContext)();
    const containers = (0, $91PtX$semappssemanticdataprovider.useContainers)(resource, "@remote");
    const dataModel = (0, $91PtX$semappssemanticdataprovider.useDataModel)(resource);
    const { watch: watch, setValue: setValue } = (0, $91PtX$reacthookform.useFormContext)();
    const watchRemoteUri = watch("remoteUri");
    const watchPlainUri = watch("plainUri");
    (0, $91PtX$react.useEffect)(()=>{
        if (watchRemoteUri) setValue("plainUri", watchRemoteUri);
    }, [
        watchRemoteUri
    ]);
    (0, $91PtX$react.useEffect)(()=>{
        if (watchPlainUri && watchPlainUri !== watchRemoteUri) setValue("remoteUri", null);
    }, [
        watchRemoteUri,
        watchPlainUri
    ]);
    if (!dataModel) return null;
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$reactjsxruntime.Fragment), {
        children: [
            containers && Object.keys(containers).length > 0 && /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$semappsinputcomponents.ReferenceInput), {
                source: "remoteUri",
                reference: resource,
                filter: {
                    _servers: "@remote",
                    _predicates: [
                        dataModel?.fieldsMapping?.title
                    ]
                },
                enableGetChoices: ({ q: q })=>!!(q && q.length > 1),
                children: /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$semappsinputcomponents.MultiServerAutocompleteInput), {
                    optionText: dataModel?.fieldsMapping?.title,
                    shouldRenderSuggestions: (value)=>value.length > 1,
                    noOptionsText: "Tapez au moins deux lettres",
                    emptyText: "Rechercher...",
                    label: "Resource distante",
                    fullWidth: true
                })
            }),
            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.TextInput), {
                source: "plainUri",
                label: "URL de la ressource distante",
                fullWidth: true
            }),
            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.RadioButtonGroupInput), {
                source: "method",
                label: "M\xe9thode d'importation",
                choices: [
                    {
                        id: "sync",
                        name: "Garder la ressource locale synchronis\xe9e avec la ressource distante"
                    },
                    {
                        id: "fork",
                        name: "Cr\xe9er une nouvelle version de la ressource (fork)"
                    }
                ]
            })
        ]
    });
};
const $eaef283c22eb901e$var$ImportForm = ({ stripProperties: stripProperties })=>{
    const resource = (0, $91PtX$reactadmin.useResourceContext)();
    const fork = (0, $3722be33fafb3622$export$2e2bcd8739ae039)(resource);
    const sync = (0, $c0bd6c85f68e28e0$export$2e2bcd8739ae039)(resource);
    const onSubmit = (0, $91PtX$react.useCallback)(async ({ plainUri: plainUri, method: method })=>{
        if (method === "fork") await fork(plainUri, stripProperties);
        else await sync(plainUri);
    }, [
        fork,
        sync,
        stripProperties
    ]);
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        defaultValues: {
            method: "sync"
        },
        children: /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)($eaef283c22eb901e$var$ImportFormInputs, {})
    });
};
var $eaef283c22eb901e$export$2e2bcd8739ae039 = $eaef283c22eb901e$var$ImportForm;


const $fb5291a8e3f7cfea$var$useStyles = (0, ($parcel$interopDefault($91PtX$muistylesmakeStyles)))(()=>({
        tab: {
            maxWidth: "unset",
            padding: "6px 24px"
        }
    }));
const $fb5291a8e3f7cfea$var$CreateOrImportForm = ({ stripProperties: stripProperties, ...rest })=>{
    const [tab, setTab] = (0, $91PtX$react.useState)(0);
    const classes = $fb5291a8e3f7cfea$var$useStyles();
    const xs = (0, $91PtX$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down("sm"), {
        noSsr: true
    });
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$muimaterial.Box), {
                pb: 2,
                children: [
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsxs)((0, $91PtX$muimaterial.Tabs), {
                        value: tab,
                        onChange: (_, v)=>setTab(v),
                        indicatorColor: "primary",
                        children: [
                            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Tab), {
                                className: classes.tab,
                                label: "Cr\xe9er"
                            }),
                            /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Tab), {
                                className: classes.tab,
                                label: xs ? "Importer" : "Importer une ressource distante"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$muimaterial.Divider), {})
                ]
            }),
            tab === 0 && /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.SimpleForm), {
                ...rest
            }),
            tab === 1 && /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $eaef283c22eb901e$export$2e2bcd8739ae039), {
                stripProperties: stripProperties || [],
                ...rest
            })
        ]
    });
};
var $fb5291a8e3f7cfea$export$2e2bcd8739ae039 = $fb5291a8e3f7cfea$var$CreateOrImportForm;







const $80075ef971c3d1de$var$LexiconImportForm = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { save: save } = (0, $91PtX$reactadmin.useSaveContext)();
    const onSubmit = (0, $91PtX$react.useCallback)(async ({ lexicon: lexicon })=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        if (!lexicon.uri) delete lexicon.summary;
        // If the user doesn't select any option, use the text as the label
        if (typeof lexicon === "string") lexicon = {
            label: lexicon
        };
        await save(selectData(lexicon));
    }, [
        selectData,
        save
    ]);
    return /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $91PtX$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        children: /*#__PURE__*/ (0, $91PtX$reactjsxruntime.jsx)((0, $3a4b4c603fe6b68b$export$2e2bcd8739ae039), {
            label: "Titre",
            source: "lexicon",
            fetchLexicon: fetchLexicon,
            validate: (0, $91PtX$reactadmin.required)()
        })
    });
};
var $80075ef971c3d1de$export$2e2bcd8739ae039 = $80075ef971c3d1de$var$LexiconImportForm;




const $32077f9119e727a8$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || "";
const $32077f9119e727a8$var$fetchWikidata = (apiUrl = "https://www.wikidata.org/w/api.php")=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch(`${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(keyword)}`);
        if (response.ok) {
            const json = await response.json();
            return json.search.map((r)=>({
                    uri: r.concepturi,
                    label: $32077f9119e727a8$var$capitalize(r.match.text),
                    summary: $32077f9119e727a8$var$capitalize(r.description),
                    icon: (0, ($parcel$interopDefault($91PtX$muiiconsmaterialLanguage)))
                }));
        }
        throw new Error("Failed to fetch Wikidata server");
    };
var $32077f9119e727a8$export$2e2bcd8739ae039 = $32077f9119e727a8$var$fetchWikidata;




const $17a31747492cb646$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || "";
const $17a31747492cb646$var$fetchESCO = (apiUrl = "https://ec.europa.eu/esco/api", type = "skill")=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch((0, ($parcel$interopDefault($91PtX$urljoin)))(apiUrl, `suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`));
        if (response.ok) {
            const json = await response.json();
            return json._embedded.results.map((r)=>({
                    uri: r.uri,
                    label: $17a31747492cb646$var$capitalize(r.title.replace("’", "'")),
                    icon: (0, ($parcel$interopDefault($91PtX$muiiconsmaterialStarBorder)))
                }));
        }
        throw new Error("Failed to fetch ESCO server");
    };
var $17a31747492cb646$export$2e2bcd8739ae039 = $17a31747492cb646$var$fetchESCO;






//# sourceMappingURL=index.cjs.js.map
