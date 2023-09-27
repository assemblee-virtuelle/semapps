import {jsxs as $e5Hbp$jsxs, jsx as $e5Hbp$jsx, Fragment as $e5Hbp$Fragment} from "react/jsx-runtime";
import $e5Hbp$react, {useState as $e5Hbp$useState, useCallback as $e5Hbp$useCallback, forwardRef as $e5Hbp$forwardRef, useMemo as $e5Hbp$useMemo, useEffect as $e5Hbp$useEffect, createElement as $e5Hbp$createElement} from "react";
import {useCreateSuggestionContext as $e5Hbp$useCreateSuggestionContext, useResourceContext as $e5Hbp$useResourceContext, useCreate as $e5Hbp$useCreate, useLocale as $e5Hbp$useLocale, useTranslate as $e5Hbp$useTranslate, useNotify as $e5Hbp$useNotify, useInput as $e5Hbp$useInput, FieldTitle as $e5Hbp$FieldTitle, InputHelperText as $e5Hbp$InputHelperText, SimpleForm as $e5Hbp$SimpleForm, TextInput as $e5Hbp$TextInput, RadioButtonGroupInput as $e5Hbp$RadioButtonGroupInput, useDataProvider as $e5Hbp$useDataProvider, useRedirect as $e5Hbp$useRedirect, useSaveContext as $e5Hbp$useSaveContext, required as $e5Hbp$required} from "react-admin";
import {Dialog as $e5Hbp$Dialog, DialogContent as $e5Hbp$DialogContent, DialogActions as $e5Hbp$DialogActions, Button as $e5Hbp$Button, TextField as $e5Hbp$TextField, Grid as $e5Hbp$Grid, Typography as $e5Hbp$Typography, useMediaQuery as $e5Hbp$useMediaQuery, Box as $e5Hbp$Box, Tabs as $e5Hbp$Tabs, Tab as $e5Hbp$Tab, Divider as $e5Hbp$Divider} from "@mui/material";
import $e5Hbp$muistylesmakeStyles from "@mui/styles/makeStyles";
import $e5Hbp$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $e5Hbp$muiiconsmaterialLanguage from "@mui/icons-material/Language";
import $e5Hbp$muiiconsmaterialAdd from "@mui/icons-material/Add";
import $e5Hbp$autosuggesthighlightmatch from "autosuggest-highlight/match";
import $e5Hbp$autosuggesthighlightparse from "autosuggest-highlight/parse";
import $e5Hbp$lodashthrottle from "lodash.throttle";
import {useFormContext as $e5Hbp$useFormContext} from "react-hook-form";
import {useContainers as $e5Hbp$useContainers, useDataModel as $e5Hbp$useDataModel} from "@semapps/semantic-data-provider";
import {ReferenceInput as $e5Hbp$ReferenceInput, MultiServerAutocompleteInput as $e5Hbp$MultiServerAutocompleteInput} from "@semapps/input-components";
import $e5Hbp$urljoin from "url-join";
import $e5Hbp$muiiconsmaterialStarBorder from "@mui/icons-material/StarBorder";

// Dialogs















const $b16cb081b32ae4c7$var$useStyles = (0, $e5Hbp$muistylesmakeStyles)((theme)=>({
        icon: {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(2)
        }
    }));
const $b16cb081b32ae4c7$var$selectOptionText = (option, optionText)=>{
    if (typeof option === "string") return option;
    if (option.label) return option.label;
    if (typeof optionText === "string") return option[optionText];
    if (typeof optionText === "function") return optionText(option);
};
const $b16cb081b32ae4c7$var$capitalizeFirstLetter = (string)=>string && string.charAt(0).toUpperCase() + string.slice(1);
const $b16cb081b32ae4c7$var$LexiconAutocompleteInput = /*#__PURE__*/ (0, $e5Hbp$forwardRef)(({ fetchLexicon: fetchLexicon, source: source, defaultValue: defaultValue, label: label, parse: parse, optionText: optionText, helperText: helperText, ...rest }, ref)=>{
    const resource = (0, $e5Hbp$useResourceContext)();
    const classes = $b16cb081b32ae4c7$var$useStyles();
    const locale = (0, $e5Hbp$useLocale)();
    const translate = (0, $e5Hbp$useTranslate)();
    const notify = (0, $e5Hbp$useNotify)();
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const { field: { value: value, onChange: onChange, onBlur: onBlur }, fieldState: { isTouched: isTouched, error: error }, formState: { submitError: submitError }, isRequired: isRequired } = (0, $e5Hbp$useInput)({
        source: source,
        defaultValue: defaultValue,
        ...rest
    });
    const [keyword, setKeyword] = (0, $e5Hbp$useState)(defaultValue); // Typed keywords
    const [options, setOptions] = (0, $e5Hbp$useState)([]); // Options returned by MapBox
    const throttledFetchLexicon = (0, $e5Hbp$useMemo)(()=>(0, $e5Hbp$lodashthrottle)((keyword, callback)=>{
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
    (0, $e5Hbp$useEffect)(()=>{
        // Do not trigger search if text input is empty
        if (!keyword) return undefined;
        throttledFetchLexicon(keyword, (results)=>setOptions(results));
    }, [
        value,
        keyword,
        throttledFetchLexicon
    ]);
    return /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$muimaterialAutocomplete), {
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
                label: $b16cb081b32ae4c7$var$capitalizeFirstLetter(keyword),
                summary: `Ajouter "${$b16cb081b32ae4c7$var$capitalizeFirstLetter(keyword)}" au dictionnaire`,
                icon: (0, $e5Hbp$muiiconsmaterialAdd)
            });
            return options;
        },
        clearOnBlur: true,
        selectOnFocus: true,
        handleHomeEndKeys: true,
        getOptionLabel: (option)=>$b16cb081b32ae4c7$var$selectOptionText(option, optionText),
        isOptionEqualToValue: (option, value)=>$b16cb081b32ae4c7$var$selectOptionText(option, optionText) === $b16cb081b32ae4c7$var$selectOptionText(value, optionText),
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
            return /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$TextField), {
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
                label: label !== "" && label !== false && /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$FieldTitle), {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }),
                error: !!(isTouched && (error || submitError)),
                helperText: /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$InputHelperText), {
                    touched: isTouched,
                    error: error || submitError,
                    helperText: helperText
                })
            });
        },
        renderOption: (props, option)=>{
            const matches = (0, $e5Hbp$autosuggesthighlightmatch)(option.label, keyword);
            const parts = (0, $e5Hbp$autosuggesthighlightparse)(option.label, matches);
            return /*#__PURE__*/ (0, $e5Hbp$createElement)((0, $e5Hbp$Grid), {
                container: true,
                alignItems: "center",
                ...props,
                key: option.uri || "create",
                children: [
                    /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Grid), {
                        item: true,
                        children: /*#__PURE__*/ (0, $e5Hbp$react).createElement(option.icon || (0, $e5Hbp$muiiconsmaterialLanguage), {
                            className: classes.icon
                        })
                    }),
                    /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Grid), {
                        item: true,
                        xs: true,
                        children: [
                            typeof parts === "string" ? parts : parts.map((part, index)=>/*#__PURE__*/ (0, $e5Hbp$jsx)("span", {
                                    style: {
                                        fontWeight: part.highlight ? 700 : 400
                                    },
                                    children: part.text
                                }, index)),
                            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Typography), {
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
$b16cb081b32ae4c7$var$LexiconAutocompleteInput.defaultProps = {
    optionText: "label"
};
var $b16cb081b32ae4c7$export$2e2bcd8739ae039 = $b16cb081b32ae4c7$var$LexiconAutocompleteInput;


const $a792efd53d1a9e0e$var$LexiconCreateDialog = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { filter: filter, onCancel: onCancel, onCreate: onCreate } = (0, $e5Hbp$useCreateSuggestionContext)();
    const resource = (0, $e5Hbp$useResourceContext)();
    const [value, setValue] = (0, $e5Hbp$useState)(filter || "");
    const [create] = (0, $e5Hbp$useCreate)();
    const onClose = (0, $e5Hbp$useCallback)(()=>{
        setValue("");
        onCancel();
    }, [
        setValue,
        onCancel
    ]);
    const onSubmit = (0, $e5Hbp$useCallback)(()=>{
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
    return /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Dialog), {
        open: true,
        onClose: onClose,
        fullWidth: true,
        maxWidth: "sm",
        children: [
            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$DialogContent), {
                children: /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $b16cb081b32ae4c7$export$2e2bcd8739ae039), {
                    source: "lexicon",
                    label: "Titre",
                    fetchLexicon: fetchLexicon,
                    defaultValue: filter,
                    value: value,
                    onChange: setValue
                })
            }),
            /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Button), {
                        onClick: onClose,
                        children: "Annuler"
                    }),
                    /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Button), {
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
var $a792efd53d1a9e0e$export$2e2bcd8739ae039 = $a792efd53d1a9e0e$var$LexiconCreateDialog;















const $bcde5854a56da897$var$useFork = (resourceId)=>{
    const dataProvider = (0, $e5Hbp$useDataProvider)();
    const redirect = (0, $e5Hbp$useRedirect)();
    const notify = (0, $e5Hbp$useNotify)();
    return (0, $e5Hbp$useCallback)(async (remoteRecordUri, stripProperties = [])=>{
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
var $bcde5854a56da897$export$2e2bcd8739ae039 = $bcde5854a56da897$var$useFork;




const $319fb528511df085$var$useSync = (resourceId)=>{
    const dataProvider = (0, $e5Hbp$useDataProvider)();
    const notify = (0, $e5Hbp$useNotify)();
    const redirect = (0, $e5Hbp$useRedirect)();
    return (0, $e5Hbp$useCallback)(async (remoteRecordUri)=>{
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
var $319fb528511df085$export$2e2bcd8739ae039 = $319fb528511df085$var$useSync;


const $7c1a5d2f905b4d36$var$ImportFormInputs = ()=>{
    const resource = (0, $e5Hbp$useResourceContext)();
    const containers = (0, $e5Hbp$useContainers)(resource, "@remote");
    const dataModel = (0, $e5Hbp$useDataModel)(resource);
    const { watch: watch, setValue: setValue } = (0, $e5Hbp$useFormContext)();
    const watchRemoteUri = watch("remoteUri");
    const watchPlainUri = watch("plainUri");
    (0, $e5Hbp$useEffect)(()=>{
        if (watchRemoteUri) setValue("plainUri", watchRemoteUri);
    }, [
        watchRemoteUri
    ]);
    (0, $e5Hbp$useEffect)(()=>{
        if (watchPlainUri && watchPlainUri !== watchRemoteUri) setValue("remoteUri", null);
    }, [
        watchRemoteUri,
        watchPlainUri
    ]);
    if (!dataModel) return null;
    return /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Fragment), {
        children: [
            containers && Object.keys(containers).length > 0 && /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$ReferenceInput), {
                source: "remoteUri",
                reference: resource,
                filter: {
                    _servers: "@remote",
                    _predicates: [
                        dataModel?.fieldsMapping?.title
                    ]
                },
                enableGetChoices: ({ q: q })=>!!(q && q.length > 1),
                children: /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$MultiServerAutocompleteInput), {
                    optionText: dataModel?.fieldsMapping?.title,
                    shouldRenderSuggestions: (value)=>value.length > 1,
                    noOptionsText: "Tapez au moins deux lettres",
                    emptyText: "Rechercher...",
                    label: "Resource distante",
                    fullWidth: true
                })
            }),
            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$TextInput), {
                source: "plainUri",
                label: "URL de la ressource distante",
                fullWidth: true
            }),
            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$RadioButtonGroupInput), {
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
const $7c1a5d2f905b4d36$var$ImportForm = ({ stripProperties: stripProperties })=>{
    const resource = (0, $e5Hbp$useResourceContext)();
    const fork = (0, $bcde5854a56da897$export$2e2bcd8739ae039)(resource);
    const sync = (0, $319fb528511df085$export$2e2bcd8739ae039)(resource);
    const onSubmit = (0, $e5Hbp$useCallback)(async ({ plainUri: plainUri, method: method })=>{
        if (method === "fork") await fork(plainUri, stripProperties);
        else await sync(plainUri);
    }, [
        fork,
        sync,
        stripProperties
    ]);
    return /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$SimpleForm), {
        onSubmit: onSubmit,
        defaultValues: {
            method: "sync"
        },
        children: /*#__PURE__*/ (0, $e5Hbp$jsx)($7c1a5d2f905b4d36$var$ImportFormInputs, {})
    });
};
var $7c1a5d2f905b4d36$export$2e2bcd8739ae039 = $7c1a5d2f905b4d36$var$ImportForm;


const $aa427a7c321e4045$var$useStyles = (0, $e5Hbp$muistylesmakeStyles)(()=>({
        tab: {
            maxWidth: "unset",
            padding: "6px 24px"
        }
    }));
const $aa427a7c321e4045$var$CreateOrImportForm = ({ stripProperties: stripProperties, ...rest })=>{
    const [tab, setTab] = (0, $e5Hbp$useState)(0);
    const classes = $aa427a7c321e4045$var$useStyles();
    const xs = (0, $e5Hbp$useMediaQuery)((theme)=>theme.breakpoints.down("sm"), {
        noSsr: true
    });
    return /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Fragment), {
        children: [
            /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Box), {
                pb: 2,
                children: [
                    /*#__PURE__*/ (0, $e5Hbp$jsxs)((0, $e5Hbp$Tabs), {
                        value: tab,
                        onChange: (_, v)=>setTab(v),
                        indicatorColor: "primary",
                        children: [
                            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Tab), {
                                className: classes.tab,
                                label: "Cr\xe9er"
                            }),
                            /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Tab), {
                                className: classes.tab,
                                label: xs ? "Importer" : "Importer une ressource distante"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$Divider), {})
                ]
            }),
            tab === 0 && /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$SimpleForm), {
                ...rest
            }),
            tab === 1 && /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $7c1a5d2f905b4d36$export$2e2bcd8739ae039), {
                stripProperties: stripProperties || [],
                ...rest
            })
        ]
    });
};
var $aa427a7c321e4045$export$2e2bcd8739ae039 = $aa427a7c321e4045$var$CreateOrImportForm;







const $fd906af5bca60fe2$var$LexiconImportForm = ({ fetchLexicon: fetchLexicon, selectData: selectData })=>{
    const { save: save } = (0, $e5Hbp$useSaveContext)();
    const onSubmit = (0, $e5Hbp$useCallback)(async ({ lexicon: lexicon })=>{
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
    return /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $e5Hbp$SimpleForm), {
        onSubmit: onSubmit,
        children: /*#__PURE__*/ (0, $e5Hbp$jsx)((0, $b16cb081b32ae4c7$export$2e2bcd8739ae039), {
            label: "Titre",
            source: "lexicon",
            fetchLexicon: fetchLexicon,
            validate: (0, $e5Hbp$required)()
        })
    });
};
var $fd906af5bca60fe2$export$2e2bcd8739ae039 = $fd906af5bca60fe2$var$LexiconImportForm;




const $905596cc8646669c$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || "";
const $905596cc8646669c$var$fetchWikidata = (apiUrl = "https://www.wikidata.org/w/api.php")=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch(`${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(keyword)}`);
        if (response.ok) {
            const json = await response.json();
            return json.search.map((r)=>({
                    uri: r.concepturi,
                    label: $905596cc8646669c$var$capitalize(r.match.text),
                    summary: $905596cc8646669c$var$capitalize(r.description),
                    icon: (0, $e5Hbp$muiiconsmaterialLanguage)
                }));
        }
        throw new Error("Failed to fetch Wikidata server");
    };
var $905596cc8646669c$export$2e2bcd8739ae039 = $905596cc8646669c$var$fetchWikidata;




const $1cadde849f110c85$var$capitalize = (s)=>s && s[0].toUpperCase() + s.slice(1) || "";
const $1cadde849f110c85$var$fetchESCO = (apiUrl = "https://ec.europa.eu/esco/api", type = "skill")=>async ({ keyword: keyword, locale: locale })=>{
        const response = await fetch((0, $e5Hbp$urljoin)(apiUrl, `suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`));
        if (response.ok) {
            const json = await response.json();
            return json._embedded.results.map((r)=>({
                    uri: r.uri,
                    label: $1cadde849f110c85$var$capitalize(r.title.replace("’", "'")),
                    icon: (0, $e5Hbp$muiiconsmaterialStarBorder)
                }));
        }
        throw new Error("Failed to fetch ESCO server");
    };
var $1cadde849f110c85$export$2e2bcd8739ae039 = $1cadde849f110c85$var$fetchESCO;






export {$a792efd53d1a9e0e$export$2e2bcd8739ae039 as LexiconCreateDialog, $aa427a7c321e4045$export$2e2bcd8739ae039 as CreateOrImportForm, $7c1a5d2f905b4d36$export$2e2bcd8739ae039 as ImportForm, $fd906af5bca60fe2$export$2e2bcd8739ae039 as LexiconImportForm, $b16cb081b32ae4c7$export$2e2bcd8739ae039 as LexiconAutocompleteInput, $905596cc8646669c$export$2e2bcd8739ae039 as fetchWikidata, $1cadde849f110c85$export$2e2bcd8739ae039 as fetchESCO, $bcde5854a56da897$export$2e2bcd8739ae039 as useFork, $319fb528511df085$export$2e2bcd8739ae039 as useSync};
//# sourceMappingURL=index.es.js.map
