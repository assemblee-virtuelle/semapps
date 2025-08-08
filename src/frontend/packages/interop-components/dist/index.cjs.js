var $as47w$reactjsxruntime = require("react/jsx-runtime");
var $as47w$react = require("react");
var $as47w$reactadmin = require("react-admin");
var $as47w$muimaterial = require("@mui/material");
var $as47w$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $as47w$muimaterialAutocomplete = require("@mui/material/Autocomplete");
var $as47w$muiiconsmaterialLanguage = require("@mui/icons-material/Language");
var $as47w$muiiconsmaterialAdd = require("@mui/icons-material/Add");
var $as47w$autosuggesthighlightmatch = require("autosuggest-highlight/match");
var $as47w$autosuggesthighlightparse = require("autosuggest-highlight/parse");
var $as47w$lodashthrottle = require("lodash.throttle");
var $as47w$reacthookform = require("react-hook-form");
var $as47w$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $as47w$semappsinputcomponents = require("@semapps/input-components");
var $as47w$urljoin = require("url-join");
var $as47w$muiiconsmaterialStarBorder = require("@mui/icons-material/StarBorder");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "LexiconCreateDialog", () => $acd5a98386bab789$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CreateOrImportForm", () => $0a2a9df1212fcaa1$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ImportForm", () => $29020659369365dd$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LexiconImportForm", () => $f72b72e09c5185b4$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LexiconAutocompleteInput", () => $1e0deedc4d046342$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchWikidata", () => $6c6c110f4bb6106c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchESCO", () => $4f3eb675e9ce71ec$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useFork", () => $4c9b9c00273623b7$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useSync", () => $b20f9c36b772f8b4$export$2e2bcd8739ae039);
// Dialogs















const $1e0deedc4d046342$var$useStyles = (0, ($parcel$interopDefault($as47w$muistylesmakeStyles)))((theme)=>({
        icon: {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(2)
        }
    }));
const $1e0deedc4d046342$var$selectOptionText = (option, optionText)=>{
    if (typeof option === 'string') return option;
    if (option.label) return option.label;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
const $1e0deedc4d046342$var$capitalizeFirstLetter = (string)=>string && string.charAt(0).toUpperCase() + string.slice(1);
const $1e0deedc4d046342$var$LexiconAutocompleteInput = /*#__PURE__*/ (0, $as47w$react.forwardRef)(// @ts-expect-error TS(2339): Property 'fetchLexicon' does not exist on type '{}... Remove this comment to see the full error message
({ fetchLexicon: fetchLexicon, source: source, defaultValue: defaultValue, label: label, parse: parse, optionText: optionText = 'label', helperText: helperText, ...rest }, ref)=>{
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2349): This expression is not callable.
    const classes = $1e0deedc4d046342$var$useStyles();
    const locale = (0, $as47w$reactadmin.useLocale)();
    const translate = (0, $as47w$reactadmin.useTranslate)();
    const notify = (0, $as47w$reactadmin.useNotify)();
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const { field: { value: value, onChange: onChange, onBlur: onBlur }, fieldState: { isTouched: isTouched, error: error }, // @ts-expect-error TS(2339): Property 'submitError' does not exist on type 'Use... Remove this comment to see the full error message
    formState: { submitError: submitError }, isRequired: isRequired } = (0, $as47w$reactadmin.useInput)({
        source: source,
        defaultValue: defaultValue,
        ...rest
    });
    const [keyword, setKeyword] = (0, $as47w$react.useState)(defaultValue); // Typed keywords
    const [options, setOptions] = (0, $as47w$react.useState)([]); // Options returned by MapBox
    const throttledFetchLexicon = (0, $as47w$react.useMemo)(()=>(0, ($parcel$interopDefault($as47w$lodashthrottle)))((keyword, callback)=>{
            fetchLexicon({
                keyword: keyword,
                locale: locale
            }).then((data)=>callback(data)).catch((e)=>notify(e.message, {
                    type: 'error'
                }));
        }, 200), [
        locale,
        fetchLexicon,
        notify
    ]);
    (0, $as47w$react.useEffect)(()=>{
        // Do not trigger search if text input is empty
        if (!keyword) return undefined;
        throttledFetchLexicon(keyword, (results)=>setOptions(results));
    }, [
        value,
        keyword,
        throttledFetchLexicon
    ]);
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, ($parcel$interopDefault($as47w$muimaterialAutocomplete))), {
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
                label: $1e0deedc4d046342$var$capitalizeFirstLetter(keyword),
                summary: `Ajouter "${$1e0deedc4d046342$var$capitalizeFirstLetter(keyword)}" au dictionnaire`,
                icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialAdd)))
            });
            return options;
        },
        clearOnBlur: true,
        selectOnFocus: true,
        handleHomeEndKeys: true,
        getOptionLabel: (option)=>$1e0deedc4d046342$var$selectOptionText(option, optionText),
        isOptionEqualToValue: (option, value)=>$1e0deedc4d046342$var$selectOptionText(option, optionText) === $1e0deedc4d046342$var$selectOptionText(value, optionText),
        // This function is called when the user selects an option
        onChange: (event, newValue)=>{
            // Parse only if the value is not null (happens if the user clears the value)
            if (newValue && parse) newValue = parse(newValue);
            onChange(newValue);
            setOptions([]);
        },
        onInputChange: (event, newKeyword)=>setKeyword(newKeyword),
        noOptionsText: translate('ra.navigation.no_results'),
        renderInput: (params)=>{
            // Autocomplete=off doesn't work anymore in modern browsers
            // https://stackoverflow.com/a/40791726/7900695
            params.inputProps.autoComplete = 'new-password';
            return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.TextField), {
                ...params,
                autoFocus: true,
                inputProps: {
                    ...params.inputProps,
                    onBlur: (e)=>{
                        onBlur(e);
                        if (params.inputProps.onBlur) // @ts-expect-error TS(2345): Argument of type 'FocusEvent<HTMLInputElement | HT... Remove this comment to see the full error message
                        params.inputProps.onBlur(e);
                    },
                    onFocus: (e)=>{
                        if (params.inputProps.onFocus) // @ts-expect-error TS(2345): Argument of type 'FocusEvent<HTMLInputElement | HT... Remove this comment to see the full error message
                        params.inputProps.onFocus(e);
                    }
                },
                label: label !== '' && label !== false && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.FieldTitle), {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }),
                error: !!(isTouched && (error || submitError)),
                // @ts-expect-error TS(2322): Type '{ touched: boolean; error: any; helperText: ... Remove this comment to see the full error message
                helperText: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.InputHelperText), {
                    touched: isTouched,
                    error: error || submitError,
                    helperText: helperText
                })
            });
        },
        renderOption: (props, option)=>{
            const matches = (0, ($parcel$interopDefault($as47w$autosuggesthighlightmatch)))(option.label, keyword);
            const parts = (0, ($parcel$interopDefault($as47w$autosuggesthighlightparse)))(option.label, matches);
            return(// @ts-expect-error TS(2769): No overload matches this call.
            /*#__PURE__*/ (0, $as47w$react.createElement)((0, $as47w$muimaterial.Grid), {
                container: true,
                alignItems: "center",
                ...props,
                key: option.uri || 'create',
                children: [
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Grid), {
                        item: true,
                        children: /*#__PURE__*/ (0, ($parcel$interopDefault($as47w$react))).createElement(option.icon || (0, ($parcel$interopDefault($as47w$muiiconsmaterialLanguage))), {
                            className: classes.icon
                        })
                    }),
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Grid), {
                        item: true,
                        xs: true,
                        children: [
                            typeof parts === 'string' ? parts : parts.map((part, index)=>/*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)("span", {
                                    style: {
                                        fontWeight: part.highlight ? 700 : 400
                                    },
                                    children: part.text
                                }, index)),
                            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Typography), {
                                variant: "body2",
                                color: "textSecondary",
                                children: option.summary
                            })
                        ]
                    })
                ]
            }));
        }
    });
});
var $1e0deedc4d046342$export$2e2bcd8739ae039 = $1e0deedc4d046342$var$LexiconAutocompleteInput;


const $acd5a98386bab789$var$LexiconCreateDialog = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { filter: filter, onCancel: onCancel, onCreate: onCreate } = (0, $as47w$reactadmin.useCreateSuggestionContext)();
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    const [value, setValue] = (0, $as47w$react.useState)(filter || '');
    const [create] = (0, $as47w$reactadmin.useCreate)();
    const onClose = (0, $as47w$react.useCallback)(()=>{
        setValue('');
        onCancel();
    }, [
        setValue,
        onCancel
    ]);
    const onSubmit = (0, $as47w$react.useCallback)(()=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'string'.
        if (!value.uri) delete value.summary;
        create(resource, {
            data: selectData(value)
        }, {
            onSuccess: (data)=>{
                console.log('onSuccess', data);
                setValue('');
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
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Dialog), {
        open: true,
        onClose: onClose,
        fullWidth: true,
        maxWidth: "sm",
        children: [
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.DialogContent), {
                children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $1e0deedc4d046342$export$2e2bcd8739ae039), {
                    // @ts-expect-error TS(2322): Type '{ source: string; label: string; fetchLexico... Remove this comment to see the full error message
                    source: "lexicon",
                    label: "Titre",
                    fetchLexicon: fetchLexicon,
                    defaultValue: filter,
                    value: value,
                    onChange: setValue
                })
            }),
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Button), {
                        onClick: onClose,
                        children: "Annuler"
                    }),
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Button), {
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
var $acd5a98386bab789$export$2e2bcd8739ae039 = $acd5a98386bab789$var$LexiconCreateDialog;















const $4c9b9c00273623b7$var$useFork = (resourceId)=>{
    const dataProvider = (0, $as47w$reactadmin.useDataProvider)();
    const redirect = (0, $as47w$reactadmin.useRedirect)();
    const notify = (0, $as47w$reactadmin.useNotify)();
    return (0, $as47w$react.useCallback)(async (remoteRecordUri, stripProperties = [])=>{
        const { data: remoteData } = await dataProvider.getOne(resourceId, {
            id: remoteRecordUri
        });
        const strippedData = {
            ...remoteData
        };
        strippedData['http://www.w3.org/ns/prov#wasDerivedFrom'] = strippedData.id;
        delete strippedData.id;
        delete strippedData['@context'];
        stripProperties.forEach((prop)=>{
            delete strippedData[prop];
        });
        const { data: localData } = await dataProvider.create(resourceId, {
            data: strippedData
        });
        redirect(`/${resourceId}/${encodeURIComponent(localData.id)}/show`);
        notify("La ressource a bien \xe9t\xe9 copi\xe9e", {
            type: 'success'
        });
    }, [
        resourceId,
        dataProvider,
        redirect,
        notify
    ]);
};
var $4c9b9c00273623b7$export$2e2bcd8739ae039 = $4c9b9c00273623b7$var$useFork;




const $b20f9c36b772f8b4$var$useSync = (resourceId)=>{
    const dataProvider = (0, $as47w$reactadmin.useDataProvider)();
    const notify = (0, $as47w$reactadmin.useNotify)();
    const redirect = (0, $as47w$reactadmin.useRedirect)();
    return (0, $as47w$react.useCallback)(async (remoteRecordUri)=>{
        // @ts-expect-error TS(2345): Argument of type '{ id: any; }' is not assignable ... Remove this comment to see the full error message
        await dataProvider.create(resourceId, {
            id: remoteRecordUri
        });
        redirect(`/${resourceId}/${encodeURIComponent(remoteRecordUri)}/show`);
        notify("La ressource a bien \xe9t\xe9 import\xe9e", {
            type: 'success'
        });
    }, [
        dataProvider,
        redirect,
        notify
    ]);
};
var $b20f9c36b772f8b4$export$2e2bcd8739ae039 = $b20f9c36b772f8b4$var$useSync;


const $29020659369365dd$var$ImportFormInputs = ()=>{
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    const containers = (0, $as47w$semappssemanticdataprovider.useContainers)(resource, '@remote');
    // @ts-expect-error TS(2345): Argument of type 'ResourceContextValue' is not ass... Remove this comment to see the full error message
    const dataModel = (0, $as47w$semappssemanticdataprovider.useDataModel)(resource);
    const { watch: watch, setValue: setValue } = (0, $as47w$reacthookform.useFormContext)();
    const watchRemoteUri = watch('remoteUri');
    const watchPlainUri = watch('plainUri');
    (0, $as47w$react.useEffect)(()=>{
        if (watchRemoteUri) setValue('plainUri', watchRemoteUri);
    }, [
        watchRemoteUri
    ]);
    (0, $as47w$react.useEffect)(()=>{
        if (watchPlainUri && watchPlainUri !== watchRemoteUri) setValue('remoteUri', null);
    }, [
        watchRemoteUri,
        watchPlainUri
    ]);
    if (!dataModel) return null;
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$reactjsxruntime.Fragment), {
        children: [
            containers && Object.keys(containers).length > 0 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$semappsinputcomponents.ReferenceInput), {
                source: "remoteUri",
                reference: resource,
                filter: {
                    _servers: '@remote',
                    _predicates: [
                        dataModel?.fieldsMapping?.title
                    ]
                },
                enableGetChoices: ({ q: q })=>!!(q && q.length > 1),
                children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$semappsinputcomponents.MultiServerAutocompleteInput), {
                    optionText: dataModel?.fieldsMapping?.title,
                    shouldRenderSuggestions: (value)=>value.length > 1,
                    noOptionsText: "Tapez au moins deux lettres",
                    emptyText: "Rechercher...",
                    label: "Resource distante",
                    fullWidth: true
                })
            }),
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.TextInput), {
                source: "plainUri",
                label: "URL de la ressource distante",
                fullWidth: true
            }),
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.RadioButtonGroupInput), {
                source: "method",
                label: "M\xe9thode d'importation",
                choices: [
                    {
                        id: 'sync',
                        name: "Garder la ressource locale synchronis\xe9e avec la ressource distante"
                    },
                    {
                        id: 'fork',
                        name: "Cr\xe9er une nouvelle version de la ressource (fork)"
                    }
                ]
            })
        ]
    });
};
const $29020659369365dd$var$ImportForm = ({ stripProperties: stripProperties })=>{
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    const fork = (0, $4c9b9c00273623b7$export$2e2bcd8739ae039)(resource);
    const sync = (0, $b20f9c36b772f8b4$export$2e2bcd8739ae039)(resource);
    const onSubmit = (0, $as47w$react.useCallback)(async ({ plainUri: plainUri, method: method })=>{
        if (method === 'fork') await fork(plainUri, stripProperties);
        else await sync(plainUri);
    }, [
        fork,
        sync,
        stripProperties
    ]);
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        defaultValues: {
            method: 'sync'
        },
        children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)($29020659369365dd$var$ImportFormInputs, {})
    });
};
var $29020659369365dd$export$2e2bcd8739ae039 = $29020659369365dd$var$ImportForm;


const $0a2a9df1212fcaa1$var$useStyles = (0, ($parcel$interopDefault($as47w$muistylesmakeStyles)))(()=>({
        tab: {
            maxWidth: 'unset',
            padding: '6px 24px'
        }
    }));
const $0a2a9df1212fcaa1$var$CreateOrImportForm = ({ stripProperties: stripProperties, ...rest })=>{
    const [tab, setTab] = (0, $as47w$react.useState)(0);
    const classes = $0a2a9df1212fcaa1$var$useStyles();
    const xs = (0, $as47w$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down('sm'), {
        noSsr: true
    });
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Box), {
                pb: 2,
                children: [
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Tabs), {
                        value: tab,
                        onChange: (_, v)=>setTab(v),
                        indicatorColor: "primary",
                        children: [
                            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Tab), {
                                className: classes.tab,
                                label: "Cr\xe9er"
                            }),
                            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Tab), {
                                className: classes.tab,
                                label: xs ? 'Importer' : 'Importer une ressource distante'
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Divider), {})
                ]
            }),
            tab === 0 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
                ...rest
            }),
            tab === 1 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $29020659369365dd$export$2e2bcd8739ae039), {
                stripProperties: stripProperties || [],
                ...rest
            })
        ]
    });
};
var $0a2a9df1212fcaa1$export$2e2bcd8739ae039 = $0a2a9df1212fcaa1$var$CreateOrImportForm;







const $f72b72e09c5185b4$var$LexiconImportForm = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { save: save } = (0, $as47w$reactadmin.useSaveContext)();
    const onSubmit = (0, $as47w$react.useCallback)(async ({ lexicon: lexicon })=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        if (!lexicon.uri) delete lexicon.summary;
        // If the user doesn't select any option, use the text as the label
        if (typeof lexicon === 'string') lexicon = {
            label: lexicon
        };
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        await save(selectData(lexicon));
    }, [
        selectData,
        save
    ]);
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $1e0deedc4d046342$export$2e2bcd8739ae039), {
            // @ts-expect-error TS(2322): Type '{ label: string; source: string; fetchLexico... Remove this comment to see the full error message
            label: "Titre",
            source: "lexicon",
            fetchLexicon: fetchLexicon,
            validate: (0, $as47w$reactadmin.required)()
        })
    });
};
var $f72b72e09c5185b4$export$2e2bcd8739ae039 = $f72b72e09c5185b4$var$LexiconImportForm;




const $6c6c110f4bb6106c$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || '';
const $6c6c110f4bb6106c$var$fetchWikidata = (apiUrl = 'https://www.wikidata.org/w/api.php')=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch(`${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(keyword)}`);
        if (response.ok) {
            const json = await response.json();
            return json.search.map((r)=>({
                    uri: r.concepturi,
                    label: $6c6c110f4bb6106c$var$capitalize(r.match.text),
                    summary: $6c6c110f4bb6106c$var$capitalize(r.description),
                    icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialLanguage)))
                }));
        }
        throw new Error('Failed to fetch Wikidata server');
    };
var $6c6c110f4bb6106c$export$2e2bcd8739ae039 = $6c6c110f4bb6106c$var$fetchWikidata;




const $4f3eb675e9ce71ec$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || '';
const $4f3eb675e9ce71ec$var$fetchESCO = (apiUrl = 'https://ec.europa.eu/esco/api', type = 'skill')=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch((0, ($parcel$interopDefault($as47w$urljoin)))(apiUrl, `suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`));
        if (response.ok) {
            const json = await response.json();
            return json._embedded.results.map((r)=>({
                    uri: r.uri,
                    label: $4f3eb675e9ce71ec$var$capitalize(r.title.replace("\u2019", "'")),
                    icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialStarBorder)))
                }));
        }
        throw new Error('Failed to fetch ESCO server');
    };
var $4f3eb675e9ce71ec$export$2e2bcd8739ae039 = $4f3eb675e9ce71ec$var$fetchESCO;






//# sourceMappingURL=index.cjs.js.map
