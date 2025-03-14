import { jsxs as $4od2P$jsxs, jsx as $4od2P$jsx, Fragment as $4od2P$Fragment } from 'react/jsx-runtime';
import $4od2P$react, {
  useState as $4od2P$useState,
  useCallback as $4od2P$useCallback,
  forwardRef as $4od2P$forwardRef,
  useMemo as $4od2P$useMemo,
  useEffect as $4od2P$useEffect,
  createElement as $4od2P$createElement
} from 'react';
import {
  useCreateSuggestionContext as $4od2P$useCreateSuggestionContext,
  useResourceContext as $4od2P$useResourceContext,
  useCreate as $4od2P$useCreate,
  useLocale as $4od2P$useLocale,
  useTranslate as $4od2P$useTranslate,
  useNotify as $4od2P$useNotify,
  useInput as $4od2P$useInput,
  FieldTitle as $4od2P$FieldTitle,
  InputHelperText as $4od2P$InputHelperText,
  SimpleForm as $4od2P$SimpleForm,
  TextInput as $4od2P$TextInput,
  RadioButtonGroupInput as $4od2P$RadioButtonGroupInput,
  useDataProvider as $4od2P$useDataProvider,
  useRedirect as $4od2P$useRedirect,
  useSaveContext as $4od2P$useSaveContext,
  required as $4od2P$required
} from 'react-admin';
import {
  Dialog as $4od2P$Dialog,
  DialogContent as $4od2P$DialogContent,
  DialogActions as $4od2P$DialogActions,
  Button as $4od2P$Button,
  TextField as $4od2P$TextField,
  Grid as $4od2P$Grid,
  Typography as $4od2P$Typography,
  useMediaQuery as $4od2P$useMediaQuery,
  Box as $4od2P$Box,
  Tabs as $4od2P$Tabs,
  Tab as $4od2P$Tab,
  Divider as $4od2P$Divider
} from '@mui/material';
import $4od2P$muistylesmakeStyles from '@mui/styles/makeStyles';
import $4od2P$muimaterialAutocomplete from '@mui/material/Autocomplete';
import $4od2P$muiiconsmaterialLanguage from '@mui/icons-material/Language';
import $4od2P$muiiconsmaterialAdd from '@mui/icons-material/Add';
import $4od2P$autosuggesthighlightmatch from 'autosuggest-highlight/match';
import $4od2P$autosuggesthighlightparse from 'autosuggest-highlight/parse';
import $4od2P$lodashthrottle from 'lodash.throttle';
import { useFormContext as $4od2P$useFormContext } from 'react-hook-form';
import {
  useContainers as $4od2P$useContainers,
  useDataModel as $4od2P$useDataModel
} from '@semapps/semantic-data-provider';
import {
  ReferenceInput as $4od2P$ReferenceInput,
  MultiServerAutocompleteInput as $4od2P$MultiServerAutocompleteInput
} from '@semapps/input-components';
import $4od2P$urljoin from 'url-join';
import $4od2P$muiiconsmaterialStarBorder from '@mui/icons-material/StarBorder';

// Dialogs

const $b16cb081b32ae4c7$var$useStyles = (0, $4od2P$muistylesmakeStyles)(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));
const $b16cb081b32ae4c7$var$selectOptionText = (option, optionText) => {
  if (typeof option === 'string') return option;
  if (option.label) return option.label;
  if (typeof optionText === 'string') return option[optionText];
  if (typeof optionText === 'function') return optionText(option);
};
const $b16cb081b32ae4c7$var$capitalizeFirstLetter = string =>
  string && string.charAt(0).toUpperCase() + string.slice(1);
const $b16cb081b32ae4c7$var$LexiconAutocompleteInput = /*#__PURE__*/ (0, $4od2P$forwardRef)(
  (
    {
      fetchLexicon: fetchLexicon,
      source: source,
      defaultValue: defaultValue,
      label: label,
      parse: parse,
      optionText: optionText,
      helperText: helperText,
      ...rest
    },
    ref
  ) => {
    const resource = (0, $4od2P$useResourceContext)();
    const classes = $b16cb081b32ae4c7$var$useStyles();
    const locale = (0, $4od2P$useLocale)();
    const translate = (0, $4od2P$useTranslate)();
    const notify = (0, $4od2P$useNotify)();
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const {
      field: { value: value, onChange: onChange, onBlur: onBlur },
      fieldState: { isTouched: isTouched, error: error },
      formState: { submitError: submitError },
      isRequired: isRequired
    } = (0, $4od2P$useInput)({
      source: source,
      defaultValue: defaultValue,
      ...rest
    });
    const [keyword, setKeyword] = (0, $4od2P$useState)(defaultValue); // Typed keywords
    const [options, setOptions] = (0, $4od2P$useState)([]); // Options returned by MapBox
    const throttledFetchLexicon = (0, $4od2P$useMemo)(
      () =>
        (0, $4od2P$lodashthrottle)((keyword, callback) => {
          fetchLexicon({
            keyword: keyword,
            locale: locale
          })
            .then(data => callback(data))
            .catch(e =>
              notify(e.message, {
                type: 'error'
              })
            );
        }, 200),
      [locale, fetchLexicon, notify]
    );
    (0, $4od2P$useEffect)(() => {
      // Do not trigger search if text input is empty
      if (!keyword) return undefined;
      throttledFetchLexicon(keyword, results => setOptions(results));
    }, [value, keyword, throttledFetchLexicon]);
    return /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$muimaterialAutocomplete), {
      fullWidth: true,
      freeSolo: true,
      autoComplete: true,
      value: value || null,
      ref: ref,
      openOnFocus: !!defaultValue,
      // We must include the current value as an option, to avoid this error
      // https://github.com/mui-org/material-ui/issues/18514#issuecomment-636096386
      options: value ? [value, ...options] : options,
      // Do not show the current value as an option (this would break renderOptions)
      filterSelectedOptions: true,
      // For some reasons, this prop has to be passed
      filterOptions: (options, params) => {
        // Suggest the creation of a new value
        if (keyword)
          options.push({
            label: $b16cb081b32ae4c7$var$capitalizeFirstLetter(keyword),
            summary: `Ajouter "${$b16cb081b32ae4c7$var$capitalizeFirstLetter(keyword)}" au dictionnaire`,
            icon: (0, $4od2P$muiiconsmaterialAdd)
          });
        return options;
      },
      clearOnBlur: true,
      selectOnFocus: true,
      handleHomeEndKeys: true,
      getOptionLabel: option => $b16cb081b32ae4c7$var$selectOptionText(option, optionText),
      isOptionEqualToValue: (option, value) =>
        $b16cb081b32ae4c7$var$selectOptionText(option, optionText) ===
        $b16cb081b32ae4c7$var$selectOptionText(value, optionText),
      // This function is called when the user selects an option
      onChange: (event, newValue) => {
        // Parse only if the value is not null (happens if the user clears the value)
        if (newValue && parse) newValue = parse(newValue);
        onChange(newValue);
        setOptions([]);
      },
      onInputChange: (event, newKeyword) => setKeyword(newKeyword),
      noOptionsText: translate('ra.navigation.no_results'),
      renderInput: params => {
        // Autocomplete=off doesn't work anymore in modern browsers
        // https://stackoverflow.com/a/40791726/7900695
        params.inputProps.autoComplete = 'new-password';
        return /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$TextField), {
          ...params,
          autoFocus: true,
          inputProps: {
            ...params.inputProps,
            onBlur: e => {
              onBlur(e);
              if (params.inputProps.onBlur) params.inputProps.onBlur(e);
            },
            onFocus: e => {
              if (params.inputProps.onFocus) params.inputProps.onFocus(e);
            }
          },
          label:
            label !== '' &&
            label !== false &&
            /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$FieldTitle), {
              label: label,
              source: source,
              resource: resource,
              isRequired: isRequired
            }),
          error: !!(isTouched && (error || submitError)),
          helperText: /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$InputHelperText), {
            touched: isTouched,
            error: error || submitError,
            helperText: helperText
          })
        });
      },
      renderOption: (props, option) => {
        const matches = (0, $4od2P$autosuggesthighlightmatch)(option.label, keyword);
        const parts = (0, $4od2P$autosuggesthighlightparse)(option.label, matches);
        return /*#__PURE__*/ (0, $4od2P$createElement)((0, $4od2P$Grid), {
          container: true,
          alignItems: 'center',
          ...props,
          key: option.uri || 'create',
          children: [
            /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Grid), {
              item: true,
              children: /*#__PURE__*/ (0, $4od2P$react).createElement(
                option.icon || (0, $4od2P$muiiconsmaterialLanguage),
                {
                  className: classes.icon
                }
              )
            }),
            /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Grid), {
              item: true,
              xs: true,
              children: [
                typeof parts === 'string'
                  ? parts
                  : parts.map((part, index) =>
                      /*#__PURE__*/ (0, $4od2P$jsx)(
                        'span',
                        {
                          style: {
                            fontWeight: part.highlight ? 700 : 400
                          },
                          children: part.text
                        },
                        index
                      )
                    ),
                /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Typography), {
                  variant: 'body2',
                  color: 'textSecondary',
                  children: option.summary
                })
              ]
            })
          ]
        });
      }
    });
  }
);
$b16cb081b32ae4c7$var$LexiconAutocompleteInput.defaultProps = {
  optionText: 'label'
};
var $b16cb081b32ae4c7$export$2e2bcd8739ae039 = $b16cb081b32ae4c7$var$LexiconAutocompleteInput;

const $a792efd53d1a9e0e$var$LexiconCreateDialog = ({ fetchLexicon: fetchLexicon, selectData: selectData }) => {
  const { filter: filter, onCancel: onCancel, onCreate: onCreate } = (0, $4od2P$useCreateSuggestionContext)();
  const resource = (0, $4od2P$useResourceContext)();
  const [value, setValue] = (0, $4od2P$useState)(filter || '');
  const [create] = (0, $4od2P$useCreate)();
  const onClose = (0, $4od2P$useCallback)(() => {
    setValue('');
    onCancel();
  }, [setValue, onCancel]);
  const onSubmit = (0, $4od2P$useCallback)(() => {
    // If we have no URI, it means we are creating a new definition
    // Delete the summary as it is "Ajouter XXX au dictionaire"
    if (!value.uri) delete value.summary;
    create(
      resource,
      {
        data: selectData(value)
      },
      {
        onSuccess: data => {
          console.log('onSuccess', data);
          setValue('');
          onCreate(data);
        }
      }
    );
  }, [create, onCreate, selectData, value, setValue, resource]);
  return /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Dialog), {
    open: true,
    onClose: onClose,
    fullWidth: true,
    maxWidth: 'sm',
    children: [
      /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$DialogContent), {
        children: /*#__PURE__*/ (0, $4od2P$jsx)((0, $b16cb081b32ae4c7$export$2e2bcd8739ae039), {
          source: 'lexicon',
          label: 'Titre',
          fetchLexicon: fetchLexicon,
          defaultValue: filter,
          value: value,
          onChange: setValue
        })
      }),
      /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$DialogActions), {
        children: [
          /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Button), {
            onClick: onClose,
            children: 'Annuler'
          }),
          /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Button), {
            variant: 'contained',
            color: 'primary',
            onClick: onSubmit,
            children: 'Ajouter'
          })
        ]
      })
    ]
  });
};
var $a792efd53d1a9e0e$export$2e2bcd8739ae039 = $a792efd53d1a9e0e$var$LexiconCreateDialog;

const $bcde5854a56da897$var$useFork = resourceId => {
  const dataProvider = (0, $4od2P$useDataProvider)();
  const redirect = (0, $4od2P$useRedirect)();
  const notify = (0, $4od2P$useNotify)();
  return (0, $4od2P$useCallback)(
    async (remoteRecordUri, stripProperties = []) => {
      const { data: remoteData } = await dataProvider.getOne(resourceId, {
        id: remoteRecordUri
      });
      const strippedData = {
        ...remoteData
      };
      strippedData['http://www.w3.org/ns/prov#wasDerivedFrom'] = strippedData.id;
      delete strippedData.id;
      delete strippedData['@context'];
      stripProperties.forEach(prop => {
        delete strippedData[prop];
      });
      const { data: localData } = await dataProvider.create(resourceId, {
        data: strippedData
      });
      redirect(`/${resourceId}/${encodeURIComponent(localData.id)}/show`);
      notify('La ressource a bien \xe9t\xe9 copi\xe9e', {
        type: 'success'
      });
    },
    [resourceId, dataProvider, redirect, notify]
  );
};
var $bcde5854a56da897$export$2e2bcd8739ae039 = $bcde5854a56da897$var$useFork;

const $319fb528511df085$var$useSync = resourceId => {
  const dataProvider = (0, $4od2P$useDataProvider)();
  const notify = (0, $4od2P$useNotify)();
  const redirect = (0, $4od2P$useRedirect)();
  return (0, $4od2P$useCallback)(
    async remoteRecordUri => {
      await dataProvider.create(resourceId, {
        id: remoteRecordUri
      });
      redirect(`/${resourceId}/${encodeURIComponent(remoteRecordUri)}/show`);
      notify('La ressource a bien \xe9t\xe9 import\xe9e', {
        type: 'success'
      });
    },
    [dataProvider, redirect, notify]
  );
};
var $319fb528511df085$export$2e2bcd8739ae039 = $319fb528511df085$var$useSync;

const $7c1a5d2f905b4d36$var$ImportFormInputs = () => {
  const resource = (0, $4od2P$useResourceContext)();
  const containers = (0, $4od2P$useContainers)(resource, '@remote');
  const dataModel = (0, $4od2P$useDataModel)(resource);
  const { watch: watch, setValue: setValue } = (0, $4od2P$useFormContext)();
  const watchRemoteUri = watch('remoteUri');
  const watchPlainUri = watch('plainUri');
  (0, $4od2P$useEffect)(() => {
    if (watchRemoteUri) setValue('plainUri', watchRemoteUri);
  }, [watchRemoteUri]);
  (0, $4od2P$useEffect)(() => {
    if (watchPlainUri && watchPlainUri !== watchRemoteUri) setValue('remoteUri', null);
  }, [watchRemoteUri, watchPlainUri]);
  if (!dataModel) return null;
  return /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Fragment), {
    children: [
      containers &&
        Object.keys(containers).length > 0 &&
        /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$ReferenceInput), {
          source: 'remoteUri',
          reference: resource,
          filter: {
            _servers: '@remote',
            _predicates: [dataModel?.fieldsMapping?.title]
          },
          enableGetChoices: ({ q: q }) => !!(q && q.length > 1),
          children: /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$MultiServerAutocompleteInput), {
            optionText: dataModel?.fieldsMapping?.title,
            shouldRenderSuggestions: value => value.length > 1,
            noOptionsText: 'Tapez au moins deux lettres',
            emptyText: 'Rechercher...',
            label: 'Resource distante',
            fullWidth: true
          })
        }),
      /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$TextInput), {
        source: 'plainUri',
        label: 'URL de la ressource distante',
        fullWidth: true
      }),
      /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$RadioButtonGroupInput), {
        source: 'method',
        label: "M\xe9thode d'importation",
        choices: [
          {
            id: 'sync',
            name: 'Garder la ressource locale synchronis\xe9e avec la ressource distante'
          },
          {
            id: 'fork',
            name: 'Cr\xe9er une nouvelle version de la ressource (fork)'
          }
        ]
      })
    ]
  });
};
const $7c1a5d2f905b4d36$var$ImportForm = ({ stripProperties: stripProperties }) => {
  const resource = (0, $4od2P$useResourceContext)();
  const fork = (0, $bcde5854a56da897$export$2e2bcd8739ae039)(resource);
  const sync = (0, $319fb528511df085$export$2e2bcd8739ae039)(resource);
  const onSubmit = (0, $4od2P$useCallback)(
    async ({ plainUri: plainUri, method: method }) => {
      if (method === 'fork') await fork(plainUri, stripProperties);
      else await sync(plainUri);
    },
    [fork, sync, stripProperties]
  );
  return /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$SimpleForm), {
    onSubmit: onSubmit,
    defaultValues: {
      method: 'sync'
    },
    children: /*#__PURE__*/ (0, $4od2P$jsx)($7c1a5d2f905b4d36$var$ImportFormInputs, {})
  });
};
var $7c1a5d2f905b4d36$export$2e2bcd8739ae039 = $7c1a5d2f905b4d36$var$ImportForm;

const $aa427a7c321e4045$var$useStyles = (0, $4od2P$muistylesmakeStyles)(() => ({
  tab: {
    maxWidth: 'unset',
    padding: '6px 24px'
  }
}));
const $aa427a7c321e4045$var$CreateOrImportForm = ({ stripProperties: stripProperties, ...rest }) => {
  const [tab, setTab] = (0, $4od2P$useState)(0);
  const classes = $aa427a7c321e4045$var$useStyles();
  const xs = (0, $4od2P$useMediaQuery)(theme => theme.breakpoints.down('sm'), {
    noSsr: true
  });
  return /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Fragment), {
    children: [
      /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Box), {
        pb: 2,
        children: [
          /*#__PURE__*/ (0, $4od2P$jsxs)((0, $4od2P$Tabs), {
            value: tab,
            onChange: (_, v) => setTab(v),
            indicatorColor: 'primary',
            children: [
              /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Tab), {
                className: classes.tab,
                label: 'Cr\xe9er'
              }),
              /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Tab), {
                className: classes.tab,
                label: xs ? 'Importer' : 'Importer une ressource distante'
              })
            ]
          }),
          /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$Divider), {})
        ]
      }),
      tab === 0 &&
        /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$SimpleForm), {
          ...rest
        }),
      tab === 1 &&
        /*#__PURE__*/ (0, $4od2P$jsx)((0, $7c1a5d2f905b4d36$export$2e2bcd8739ae039), {
          stripProperties: stripProperties || [],
          ...rest
        })
    ]
  });
};
var $aa427a7c321e4045$export$2e2bcd8739ae039 = $aa427a7c321e4045$var$CreateOrImportForm;

const $fd906af5bca60fe2$var$LexiconImportForm = ({ fetchLexicon: fetchLexicon, selectData: selectData }) => {
  const { save: save } = (0, $4od2P$useSaveContext)();
  const onSubmit = (0, $4od2P$useCallback)(
    async ({ lexicon: lexicon }) => {
      // If we have no URI, it means we are creating a new definition
      // Delete the summary as it is "Ajouter XXX au dictionaire"
      if (!lexicon.uri) delete lexicon.summary;
      // If the user doesn't select any option, use the text as the label
      if (typeof lexicon === 'string')
        lexicon = {
          label: lexicon
        };
      await save(selectData(lexicon));
    },
    [selectData, save]
  );
  return /*#__PURE__*/ (0, $4od2P$jsx)((0, $4od2P$SimpleForm), {
    onSubmit: onSubmit,
    children: /*#__PURE__*/ (0, $4od2P$jsx)((0, $b16cb081b32ae4c7$export$2e2bcd8739ae039), {
      label: 'Titre',
      source: 'lexicon',
      fetchLexicon: fetchLexicon,
      validate: (0, $4od2P$required)()
    })
  });
};
var $fd906af5bca60fe2$export$2e2bcd8739ae039 = $fd906af5bca60fe2$var$LexiconImportForm;

const $905596cc8646669c$var$capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || '';
const $905596cc8646669c$var$fetchWikidata =
  (apiUrl = 'https://www.wikidata.org/w/api.php') =>
  async ({ keyword: keyword, locale: locale }) => {
    const response = await fetch(
      `${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(keyword)}`
    );
    if (response.ok) {
      const json = await response.json();
      return json.search.map(r => ({
        uri: r.concepturi,
        label: $905596cc8646669c$var$capitalize(r.match.text),
        summary: $905596cc8646669c$var$capitalize(r.description),
        icon: (0, $4od2P$muiiconsmaterialLanguage)
      }));
    }
    throw new Error('Failed to fetch Wikidata server');
  };
var $905596cc8646669c$export$2e2bcd8739ae039 = $905596cc8646669c$var$fetchWikidata;

const $1cadde849f110c85$var$capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || '';
const $1cadde849f110c85$var$fetchESCO =
  (apiUrl = 'https://ec.europa.eu/esco/api', type = 'skill') =>
  async ({ keyword: keyword, locale: locale }) => {
    const response = await fetch(
      (0, $4od2P$urljoin)(
        apiUrl,
        `suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`
      )
    );
    if (response.ok) {
      const json = await response.json();
      return json._embedded.results.map(r => ({
        uri: r.uri,
        label: $1cadde849f110c85$var$capitalize(r.title.replace('\u2019', "'")),
        icon: (0, $4od2P$muiiconsmaterialStarBorder)
      }));
    }
    throw new Error('Failed to fetch ESCO server');
  };
var $1cadde849f110c85$export$2e2bcd8739ae039 = $1cadde849f110c85$var$fetchESCO;

export {
  $a792efd53d1a9e0e$export$2e2bcd8739ae039 as LexiconCreateDialog,
  $aa427a7c321e4045$export$2e2bcd8739ae039 as CreateOrImportForm,
  $7c1a5d2f905b4d36$export$2e2bcd8739ae039 as ImportForm,
  $fd906af5bca60fe2$export$2e2bcd8739ae039 as LexiconImportForm,
  $b16cb081b32ae4c7$export$2e2bcd8739ae039 as LexiconAutocompleteInput,
  $905596cc8646669c$export$2e2bcd8739ae039 as fetchWikidata,
  $1cadde849f110c85$export$2e2bcd8739ae039 as fetchESCO,
  $bcde5854a56da897$export$2e2bcd8739ae039 as useFork,
  $319fb528511df085$export$2e2bcd8739ae039 as useSync
};
//# sourceMappingURL=index.es.js.map
