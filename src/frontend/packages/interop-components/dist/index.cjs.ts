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


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "LexiconCreateDialog", () => $af88cd35a927a884$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "CreateOrImportForm", () => $fb5291a8e3f7cfea$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ImportForm", () => $eaef283c22eb901e$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "LexiconImportForm", () => $80075ef971c3d1de$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "LexiconAutocompleteInput", () => $3a4b4c603fe6b68b$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "fetchWikidata", () => $32077f9119e727a8$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "fetchESCO", () => $17a31747492cb646$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "useFork", () => $3722be33fafb3622$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "useSync", () => $c0bd6c85f68e28e0$export$2e2bcd8739ae039);
// Dialogs















// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $3a4b4c603fe6b68b$var$useStyles = (0, ($parcel$interopDefault($as47w$muistylesmakeStyles)))((theme: any) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }
}));
const $3a4b4c603fe6b68b$var$selectOptionText = (option: any, optionText: any)=>{
    if (typeof option === 'string') return option;
    if (option.label) return option.label;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
const $3a4b4c603fe6b68b$var$capitalizeFirstLetter = (string: any) => string && string.charAt(0).toUpperCase() + string.slice(1);
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $3a4b4c603fe6b68b$var$LexiconAutocompleteInput = /*#__PURE__*/ (0, $as47w$react.forwardRef)(({ fetchLexicon: fetchLexicon, source: source, defaultValue: defaultValue, label: label, parse: parse, optionText: optionText = 'label', helperText: helperText, ...rest }, ref: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    const classes = $3a4b4c603fe6b68b$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const locale = (0, $as47w$reactadmin.useLocale)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $as47w$reactadmin.useTranslate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const notify = (0, $as47w$reactadmin.useNotify)();
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange, onBlur: onBlur }, fieldState: { isTouched: isTouched, error: error }, formState: { submitError: submitError }, isRequired: isRequired } = (0, $as47w$reactadmin.useInput)({
        source: source,
        defaultValue: defaultValue,
        ...rest
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [keyword, setKeyword] = (0, $as47w$react.useState)(defaultValue); // Typed keywords
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [options, setOptions] = (0, $as47w$react.useState)([]); // Options returned by MapBox
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const throttledFetchLexicon = (0, $as47w$react.useMemo)(()=>(0, ($parcel$interopDefault($as47w$lodashthrottle)))((keyword: any, callback: any)=>{
            fetchLexicon({
                keyword: keyword,
                locale: locale
            }).then((data: any) => callback(data)).catch((e: any) => notify(e.message, {
                    type: 'error'
                }));
        }, 200), [
        locale,
        fetchLexicon,
        notify
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $as47w$react.useEffect)(()=>{
        // Do not trigger search if text input is empty
        if (!keyword) return undefined;
        throttledFetchLexicon(keyword, (results: any) => setOptions(results));
    }, [
        value,
        keyword,
        throttledFetchLexicon
    ]);
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, ($parcel$interopDefault($as47w$muimaterialAutocomplete))), {
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
            filterOptions: (options: any, params: any)=>{
                // Suggest the creation of a new value
                if (keyword) options.push({
                    label: $3a4b4c603fe6b68b$var$capitalizeFirstLetter(keyword),
                    summary: `Ajouter "${$3a4b4c603fe6b68b$var$capitalizeFirstLetter(keyword)}" au dictionnaire`,
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialAdd)))
                });
                return options;
            },
            clearOnBlur: true,
            selectOnFocus: true,
            handleHomeEndKeys: true,
            getOptionLabel: (option: any) => $3a4b4c603fe6b68b$var$selectOptionText(option, optionText),
            isOptionEqualToValue: (option: any, value: any)=>$3a4b4c603fe6b68b$var$selectOptionText(option, optionText) === $3a4b4c603fe6b68b$var$selectOptionText(value, optionText),
            // This function is called when the user selects an option
            onChange: (event: any, newValue: any)=>{
                // Parse only if the value is not null (happens if the user clears the value)
                if (newValue && parse) newValue = parse(newValue);
                onChange(newValue);
                setOptions([]);
            },
            onInputChange: (event: any, newKeyword: any)=>setKeyword(newKeyword),
            noOptionsText: translate('ra.navigation.no_results'),
            renderInput: (params: any) => {
                // Autocomplete=off doesn't work anymore in modern browsers
                // https://stackoverflow.com/a/40791726/7900695
                params.inputProps.autoComplete = 'new-password';
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.TextField), {
                        ...params,
                        autoFocus: true,
                        inputProps: {
                            ...params.inputProps,
                            onBlur: (e: any) => {
                                onBlur(e);
                                if (params.inputProps.onBlur) params.inputProps.onBlur(e);
                            },
                            onFocus: (e: any) => {
                                if (params.inputProps.onFocus) params.inputProps.onFocus(e);
                            }
                        },
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        label: label !== '' && label !== false && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.FieldTitle), {
                            label: label,
                            source: source,
                            resource: resource,
                            isRequired: isRequired
                        }),
                        error: !!(isTouched && (error || submitError)),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        helperText: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.InputHelperText), {
                            touched: isTouched,
                            error: error || submitError,
                            helperText: helperText
                        })
                    })
                );
            },
            renderOption: (props: any, option: any)=>{
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const matches = (0, ($parcel$interopDefault($as47w$autosuggesthighlightmatch)))(option.label, keyword);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const parts = (0, ($parcel$interopDefault($as47w$autosuggesthighlightparse)))(option.label, matches);
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $as47w$react.createElement)((0, $as47w$muimaterial.Grid), {
                        container: true,
                        alignItems: "center",
                        ...props,
                        key: option.uri || 'create',
                        children: [
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Grid), {
                                item: true,
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                children: /*#__PURE__*/ (0, ($parcel$interopDefault($as47w$react))).createElement(option.icon || (0, ($parcel$interopDefault($as47w$muiiconsmaterialLanguage))), {
                                    className: classes.icon
                                })
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Grid), {
                                item: true,
                                xs: true,
                                children: [
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    typeof parts === 'string' ? parts : parts.map((part: any, index: any)=>/*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)("span", {
                                            style: {
                                                fontWeight: part.highlight ? 700 : 400
                                            },
                                            children: part.text
                                        }, index)),
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Typography), {
                                        variant: "body2",
                                        color: "textSecondary",
                                        children: option.summary
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        })
    );
});
var $3a4b4c603fe6b68b$export$2e2bcd8739ae039 = $3a4b4c603fe6b68b$var$LexiconAutocompleteInput;


// @ts-expect-error TS(7031): Binding element 'fetchLexicon' implicitly has an '... Remove this comment to see the full error message
const $af88cd35a927a884$var$LexiconCreateDialog = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { filter: filter, onCancel: onCancel, onCreate: onCreate } = (0, $as47w$reactadmin.useCreateSuggestionContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [value, setValue] = (0, $as47w$react.useState)(filter || '');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [create] = (0, $as47w$reactadmin.useCreate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const onClose = (0, $as47w$react.useCallback)(()=>{
        setValue('');
        onCancel();
    }, [
        setValue,
        onCancel
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const onSubmit = (0, $as47w$react.useCallback)(()=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        if (!value.uri) delete value.summary;
        create(resource, {
            data: selectData(value)
        }, {
            onSuccess: (data: any) => {
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Dialog), {
        open: true,
        onClose: onClose,
        fullWidth: true,
        maxWidth: "sm",
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.DialogContent), {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $3a4b4c603fe6b68b$export$2e2bcd8739ae039), {
                    source: "lexicon",
                    label: "Titre",
                    fetchLexicon: fetchLexicon,
                    defaultValue: filter,
                    value: value,
                    onChange: setValue
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.DialogActions), {
                children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Button), {
                        onClick: onClose,
                        children: "Annuler"
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
var $af88cd35a927a884$export$2e2bcd8739ae039 = $af88cd35a927a884$var$LexiconCreateDialog;















const $3722be33fafb3622$var$useFork = (resourceId: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $as47w$reactadmin.useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const redirect = (0, $as47w$reactadmin.useRedirect)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const notify = (0, $as47w$reactadmin.useNotify)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return (0, $as47w$react.useCallback)(async (remoteRecordUri: any, stripProperties = [])=>{
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
var $3722be33fafb3622$export$2e2bcd8739ae039 = $3722be33fafb3622$var$useFork;




const $c0bd6c85f68e28e0$var$useSync = (resourceId: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $as47w$reactadmin.useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const notify = (0, $as47w$reactadmin.useNotify)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const redirect = (0, $as47w$reactadmin.useRedirect)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return (0, $as47w$react.useCallback)(async (remoteRecordUri: any) => {
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
var $c0bd6c85f68e28e0$export$2e2bcd8739ae039 = $c0bd6c85f68e28e0$var$useSync;


const $eaef283c22eb901e$var$ImportFormInputs = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const containers = (0, $as47w$semappssemanticdataprovider.useContainers)(resource, '@remote');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataModel = (0, $as47w$semappssemanticdataprovider.useDataModel)(resource);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { watch: watch, setValue: setValue } = (0, $as47w$reacthookform.useFormContext)();
    const watchRemoteUri = watch('remoteUri');
    const watchPlainUri = watch('plainUri');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $as47w$react.useEffect)(()=>{
        if (watchRemoteUri) setValue('plainUri', watchRemoteUri);
    }, [
        watchRemoteUri
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $as47w$react.useEffect)(()=>{
        if (watchPlainUri && watchPlainUri !== watchRemoteUri) setValue('remoteUri', null);
    }, [
        watchRemoteUri,
        watchPlainUri
    ]);
    if (!dataModel) return null;
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$reactjsxruntime.Fragment), {
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                containers && Object.keys(containers).length > 0 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$semappsinputcomponents.ReferenceInput), {
                    source: "remoteUri",
                    reference: resource,
                    filter: {
                        _servers: '@remote',
                        _predicates: [
                            dataModel?.fieldsMapping?.title
                        ]
                    },
                    // @ts-expect-error TS(7031): Binding element 'q' implicitly has an 'any' type.
                    enableGetChoices: ({ q: q })=>!!(q && q.length > 1),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$semappsinputcomponents.MultiServerAutocompleteInput), {
                        optionText: dataModel?.fieldsMapping?.title,
                        shouldRenderSuggestions: (value: any) => value.length > 1,
                        noOptionsText: "Tapez au moins deux lettres",
                        emptyText: "Rechercher...",
                        label: "Resource distante",
                        fullWidth: true
                    })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.TextInput), {
                    source: "plainUri",
                    label: "URL de la ressource distante",
                    fullWidth: true
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
        })
    );
};
// @ts-expect-error TS(7031): Binding element 'stripProperties' implicitly has a... Remove this comment to see the full error message
const $eaef283c22eb901e$var$ImportForm = ({ stripProperties: stripProperties })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $as47w$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const fork = (0, $3722be33fafb3622$export$2e2bcd8739ae039)(resource);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const sync = (0, $c0bd6c85f68e28e0$export$2e2bcd8739ae039)(resource);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const onSubmit = (0, $as47w$react.useCallback)(async ({ plainUri: plainUri, method: method })=>{
        if (method === 'fork') await fork(plainUri, stripProperties);
        else await sync(plainUri);
    }, [
        fork,
        sync,
        stripProperties
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        defaultValues: {
            method: 'sync'
        },
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)($eaef283c22eb901e$var$ImportFormInputs, {})
    });
};
var $eaef283c22eb901e$export$2e2bcd8739ae039 = $eaef283c22eb901e$var$ImportForm;


// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $fb5291a8e3f7cfea$var$useStyles = (0, ($parcel$interopDefault($as47w$muistylesmakeStyles)))(()=>({
        tab: {
            maxWidth: 'unset',
            padding: '6px 24px'
        }
    }));
// @ts-expect-error TS(7031): Binding element 'stripProperties' implicitly has a... Remove this comment to see the full error message
const $fb5291a8e3f7cfea$var$CreateOrImportForm = ({ stripProperties: stripProperties, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [tab, setTab] = (0, $as47w$react.useState)(0);
    const classes = $fb5291a8e3f7cfea$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const xs = (0, $as47w$muimaterial.useMediaQuery)((theme: any) => theme.breakpoints.down('sm'), {
        noSsr: true
    });
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$reactjsxruntime.Fragment), {
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Box), {
                    pb: 2,
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsxs)((0, $as47w$muimaterial.Tabs), {
                            value: tab,
                            onChange: (_: any, v: any)=>setTab(v),
                            indicatorColor: "primary",
                            children: [
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Tab), {
                                    className: classes.tab,
                                    label: "Cr\xe9er"
                                }),
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Tab), {
                                    className: classes.tab,
                                    label: xs ? 'Importer' : 'Importer une ressource distante'
                                })
                            ]
                        }),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$muimaterial.Divider), {})
                    ]
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                tab === 0 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
                    ...rest
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                tab === 1 && /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $eaef283c22eb901e$export$2e2bcd8739ae039), {
                    stripProperties: stripProperties || [],
                    ...rest
                })
            ]
        })
    );
};
var $fb5291a8e3f7cfea$export$2e2bcd8739ae039 = $fb5291a8e3f7cfea$var$CreateOrImportForm;







// @ts-expect-error TS(7031): Binding element 'fetchLexicon' implicitly has an '... Remove this comment to see the full error message
const $80075ef971c3d1de$var$LexiconImportForm = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { save: save } = (0, $as47w$reactadmin.useSaveContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const onSubmit = (0, $as47w$react.useCallback)(async ({ lexicon: lexicon })=>{
        // If we have no URI, it means we are creating a new definition
        // Delete the summary as it is "Ajouter XXX au dictionaire"
        if (!lexicon.uri) delete lexicon.summary;
        // If the user doesn't select any option, use the text as the label
        if (typeof lexicon === 'string') lexicon = {
            label: lexicon
        };
        await save(selectData(lexicon));
    }, [
        selectData,
        save
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $as47w$reactadmin.SimpleForm), {
        onSubmit: onSubmit,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $as47w$reactjsxruntime.jsx)((0, $3a4b4c603fe6b68b$export$2e2bcd8739ae039), {
            label: "Titre",
            source: "lexicon",
            fetchLexicon: fetchLexicon,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            validate: (0, $as47w$reactadmin.required)()
        })
    });
};
var $80075ef971c3d1de$export$2e2bcd8739ae039 = $80075ef971c3d1de$var$LexiconImportForm;




const $32077f9119e727a8$var$capitalize = (s: any) => s && s[0].toUpperCase() + s.slice(1) || '';
// @ts-expect-error TS(7031): Binding element 'keyword' implicitly has an 'any' ... Remove this comment to see the full error message
const $32077f9119e727a8$var$fetchWikidata = (apiUrl = 'https://www.wikidata.org/w/api.php')=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch(`${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(keyword)}`);
        if (response.ok) {
            const json = await response.json();
            return json.search.map((r: any) => ({
                uri: r.concepturi,
                label: $32077f9119e727a8$var$capitalize(r.match.text),
                summary: $32077f9119e727a8$var$capitalize(r.description),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialLanguage)))
            }));
        }
        throw new Error('Failed to fetch Wikidata server');
    };
var $32077f9119e727a8$export$2e2bcd8739ae039 = $32077f9119e727a8$var$fetchWikidata;




const $17a31747492cb646$var$capitalize = (s: any) => s && s[0].toUpperCase() + s.slice(1) || '';
// @ts-expect-error TS(7031): Binding element 'keyword' implicitly has an 'any' ... Remove this comment to see the full error message
const $17a31747492cb646$var$fetchESCO = (apiUrl = 'https://ec.europa.eu/esco/api', type = 'skill')=>async ({ keyword: keyword, locale: locale })=>{
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const response = await fetch((0, ($parcel$interopDefault($as47w$urljoin)))(apiUrl, `suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`));
        if (response.ok) {
            const json = await response.json();
            return json._embedded.results.map((r: any) => ({
                uri: r.uri,
                label: $17a31747492cb646$var$capitalize(r.title.replace("\u2019", "'")),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                icon: (0, ($parcel$interopDefault($as47w$muiiconsmaterialStarBorder)))
            }));
        }
        throw new Error('Failed to fetch ESCO server');
    };
var $17a31747492cb646$export$2e2bcd8739ae039 = $17a31747492cb646$var$fetchESCO;






//# sourceMappingURL=index.cjs.js.map
