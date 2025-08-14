import { jsxs as $9pxSs$jsxs, jsx as $9pxSs$jsx, Fragment as $9pxSs$Fragment } from 'react/jsx-runtime';
import $9pxSs$react, {
  useState as $9pxSs$useState,
  useMemo as $9pxSs$useMemo,
  useCallback as $9pxSs$useCallback,
  useEffect as $9pxSs$useEffect,
  cloneElement as $9pxSs$cloneElement,
  Children as $9pxSs$Children
} from 'react';
import {
  useRecordContext as $9pxSs$useRecordContext,
  RecordContextProvider as $9pxSs$RecordContextProvider,
  ReferenceArrayField as $9pxSs$ReferenceArrayField,
  ReferenceField as $9pxSs$ReferenceField,
  usePermissions as $9pxSs$usePermissions,
  useShowContext as $9pxSs$useShowContext,
  useDataProvider as $9pxSs$useDataProvider,
  useTranslate as $9pxSs$useTranslate,
  useRefresh as $9pxSs$useRefresh,
  useNotify as $9pxSs$useNotify,
  useGetResourceLabel as $9pxSs$useGetResourceLabel,
  Button as $9pxSs$Button,
  useCreatePath as $9pxSs$useCreatePath,
  useResourceDefinition as $9pxSs$useResourceDefinition,
  useListContext as $9pxSs$useListContext,
  Link as $9pxSs$Link
} from 'react-admin';
import {
  Box as $9pxSs$Box,
  Avatar as $9pxSs$Avatar,
  Chip as $9pxSs$Chip,
  Dialog as $9pxSs$Dialog,
  DialogTitle as $9pxSs$DialogTitle,
  DialogContent as $9pxSs$DialogContent,
  TextField as $9pxSs$TextField,
  DialogActions as $9pxSs$DialogActions,
  List as $9pxSs$List,
  ListItem as $9pxSs$ListItem,
  ListItemAvatar as $9pxSs$ListItemAvatar,
  ListItemText as $9pxSs$ListItemText,
  ListItemSecondaryAction as $9pxSs$ListItemSecondaryAction,
  IconButton as $9pxSs$IconButton,
  CircularProgress as $9pxSs$CircularProgress,
  LinearProgress as $9pxSs$LinearProgress
} from '@mui/material';
// @ts-expect-error TS(2307): Cannot find module '@mui/styles/makeStyles' or its... Remove this comment to see the full error message
import { makeStyles } from 'tss-react/mui';
import $9pxSs$muiiconsmaterialLaunch from '@mui/icons-material/Launch';
import { useForm as $9pxSs$useForm } from 'react-hook-form';
import $9pxSs$muiiconsmaterialAdd from '@mui/icons-material/Add';
import {
  useDataModel as $9pxSs$useDataModel,
  useDataServers as $9pxSs$useDataServers
} from '@semapps/semantic-data-provider';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import $9pxSs$lodashdebounce from 'lodash.debounce';
import $9pxSs$muiiconsmaterialVisibility from '@mui/icons-material/Visibility';
import $9pxSs$muiiconsmaterialError from '@mui/icons-material/Error';
import $9pxSs$muiiconsmaterialLanguage from '@mui/icons-material/Language';
import $9pxSs$muiiconsmaterialFacebook from '@mui/icons-material/Facebook';
import $9pxSs$muiiconsmaterialGitHub from '@mui/icons-material/GitHub';
import $9pxSs$muiiconsmaterialTwitter from '@mui/icons-material/Twitter';
import $9pxSs$muiiconsmaterialInstagram from '@mui/icons-material/Instagram';
import $9pxSs$muiiconsmaterialYouTube from '@mui/icons-material/YouTube';
import { FiGitlab as $9pxSs$FiGitlab } from 'react-icons/fi';

// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $548fb3c4c04d834a$var$useStyles = (0, $9pxSs$muistylesmakeStyles)((theme: any) => ({
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
const $548fb3c4c04d834a$var$handleClick = () => {};
// @ts-expect-error TS(7031): Binding element 'label' implicitly has an 'any' ty... Remove this comment to see the full error message
const $548fb3c4c04d834a$var$AvatarWithLabelField = ({
  label: label,
  defaultLabel: defaultLabel,
  image: image,
  fallback: fallback,
  externalLink: externalLink = false,
  labelColor: labelColor = 'secondary',
  classes: classes,
  ...rest
}) => {
  classes = $548fb3c4c04d834a$var$useStyles(classes);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const computedLabel = (typeof label === 'function' ? label(record) : record[label]) || defaultLabel;
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const computedImage = typeof image === 'function' ? image(record) : record[image];
  const computedFallback = typeof fallback === 'function' ? fallback(record) : fallback;
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$Box), {
    className: classes.parent,
    children: [
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      /*#__PURE__*/ (0, $9pxSs$jsx)('div', {
        className: classes.square,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Avatar), {
          src: computedImage || computedFallback,
          alt: computedLabel,
          fallback: computedFallback,
          ...rest,
          className: classes.avatar
        })
      }),
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      !computedLabel
        ? null
        : externalLink
          ? /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Chip), {
              color: labelColor,
              className: classes.chip,
              size: 'small',
              label: computedLabel,
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
              deleteIcon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialLaunch), {
                className: classes.launchIcon
              }),
              onDelete: $548fb3c4c04d834a$var$handleClick
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            })
          : /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Chip), {
              color: labelColor,
              className: classes.chip,
              size: 'small',
              label: computedLabel
            })
    ]
  });
};
var $548fb3c4c04d834a$export$2e2bcd8739ae039 = $548fb3c4c04d834a$var$AvatarWithLabelField;

// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $867e5374e5f64b17$var$ReferenceArrayField = ({ source: source, ...otherProps }) => {
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  if (record?.[source]) {
    if (!Array.isArray(record[source])) record[source] = [record[source]];
    record[source] = record[source].map((i: any) => i['@id'] || i.id || i);
  }
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$RecordContextProvider), {
    value: record,
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ReferenceArrayField), {
      source: source,
      ...otherProps
    })
  });
};
var $867e5374e5f64b17$export$2e2bcd8739ae039 = $867e5374e5f64b17$var$ReferenceArrayField;

// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $e253ae5050c248a7$var$ReferenceField = ({ source: source, ...otherProps }) => {
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  if (record[source]) {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (typeof record[source] === 'object') record[source] = record[source]['@id'] || record[source].id;
  }
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$RecordContextProvider), {
    value: record,
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ReferenceField), {
      record: record,
      source: source,
      ...otherProps
    })
  });
};
var $e253ae5050c248a7$export$2e2bcd8739ae039 = $e253ae5050c248a7$var$ReferenceField;

// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $6bf8168f746430d4$var$useStyles = (0, $9pxSs$muistylesmakeStyles)((theme: any) => ({
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
const $6bf8168f746430d4$var$getServerName = (resourceUri: any, dataServers: any) => {
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const server = dataServers && Object.values(dataServers).find(server => resourceUri.startsWith(server.baseUrl));
  return server ? server.name : 'Inconnu';
};
// @ts-expect-error TS(7031): Binding element 'keyword' implicitly has an 'any' ... Remove this comment to see the full error message
const $6bf8168f746430d4$var$ResultsList = ({
  keyword: keyword,
  source: source,
  reference: reference,
  appendLink: appendLink,
  switchToCreate: switchToCreate
}) => {
  const classes = $6bf8168f746430d4$var$useStyles();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [loading, setLoading] = (0, $9pxSs$useState)(false);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [loaded, setLoaded] = (0, $9pxSs$useState)(false);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [results, setResults] = (0, $9pxSs$useState)([]);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const translate = (0, $9pxSs$useTranslate)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const dataProvider = (0, $9pxSs$useDataProvider)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const dataServers = (0, $9pxSs$useDataServers)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const createPath = (0, $9pxSs$useCreatePath)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const referenceDefinition = (0, $9pxSs$useResourceDefinition)({
    resource: reference
  });
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const getResourceLabel = (0, $9pxSs$useGetResourceLabel)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const dataModel = (0, $9pxSs$useDataModel)(reference);
  if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title)
    throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const search = (0, $9pxSs$useMemo)(
    () =>
      (0, $9pxSs$lodashdebounce)((keyword: any) => {
        dataProvider
          .getList(reference, {
            pagination: {
              page: 1,
              perPage: 100
            },
            sort: {
              // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
              field: dataModel?.fieldsMapping?.title,
              order: 'ASC'
            },
            filter: {
              q: keyword,
              _predicates: [
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                dataModel.fieldsMapping.title
              ],
              _servers: '@all'
            }
          })
          .then(({ data: data }) => {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            const existingLinks = record[source]
              ? Array.isArray(record[source])
                ? record[source]
                : [
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    record[source]
                  ]
              : [];
            const newLinks = data.filter(record => !existingLinks.includes(record.id));
            // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
            setResults(newLinks);
            setLoaded(true);
            setLoading(false);
          })
          .catch(e => {
            setLoading(false);
          });
      }, 700),
    [dataProvider, dataModel, record, source, reference, setResults, setLoading, setLoaded]
  );
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  (0, $9pxSs$useEffect)(() => {
    if (!keyword) return undefined;
    setLoading(true);
    setLoaded(false);
    search(keyword);
    return () => search.cancel();
  }, [keyword, search, setLoading]);
  if (!keyword) return null;
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$List), {
    dense: true,
    className: classes.root,
    children: [
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      loaded &&
        results.map(resource =>
          /*#__PURE__*/ (0, $9pxSs$jsxs)(
            (0, $9pxSs$ListItem),
            {
              button: true,
              // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
              onClick: () => appendLink(resource.id),
              children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemAvatar), {
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Avatar), {
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $9pxSs$react).createElement(referenceDefinition.icon)
                  })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemText), {
                  className: classes.primaryText,
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  primary: resource[dataModel.fieldsMapping.title]
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemText), {
                  className: classes.secondaryText,
                  // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
                  primary: $6bf8168f746430d4$var$getServerName(resource.id, dataServers)
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemSecondaryAction), {
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)('a', {
                    href: createPath({
                      resource: reference,
                      // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
                      id: resource.id,
                      type: 'show'
                    }),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$IconButton), {
                      edge: 'end',
                      size: 'large',
                      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                      children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialVisibility), {})
                    })
                  })
                })
              ]
              // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
            },
            resource.id
          )
        ),
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      loaded &&
        results.length === 0 &&
        /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$ListItem), {
          children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemAvatar), {
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
              children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Avatar), {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialError), {})
              })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemText), {
              className: classes.primaryText,
              primary: translate('ra.navigation.no_results')
            })
          ]
        }),
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      loaded &&
        referenceDefinition.hasCreate &&
        /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$ListItem), {
          button: true,
          onClick: switchToCreate,
          children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemAvatar), {
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
              children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Avatar), {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialAdd), {})
              })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$ListItemText), {
              className: classes.primaryText,
              primary: translate('ra.page.create', {
                name: getResourceLabel(reference, 1)
              })
            })
          ]
        }),
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      loading &&
        /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Box), {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 150,
          // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
          children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$CircularProgress), {
            size: 60,
            thickness: 6
          })
        })
    ]
  });
};
var $6bf8168f746430d4$export$2e2bcd8739ae039 = $6bf8168f746430d4$var$ResultsList;

// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $3d5bffcd1289119f$var$useStyles = (0, $9pxSs$muistylesmakeStyles)(() => ({
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
const $3d5bffcd1289119f$var$QuickAppendDialog = ({
  open: open,
  onClose: onClose,
  subjectUri: subjectUri,
  source: source,
  reference: reference
}) => {
  const classes = $3d5bffcd1289119f$var$useStyles();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const { resource: resource } = (0, $9pxSs$useShowContext)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [keyword, setKeyword] = (0, $9pxSs$useState)('');
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [panel, setPanel] = (0, $9pxSs$useState)('find');
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const dataProvider = (0, $9pxSs$useDataProvider)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const translate = (0, $9pxSs$useTranslate)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const refresh = (0, $9pxSs$useRefresh)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const notify = (0, $9pxSs$useNotify)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const getResourceLabel = (0, $9pxSs$useGetResourceLabel)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const dataModel = (0, $9pxSs$useDataModel)(reference);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const { register: register, setValue: setValue, handleSubmit: handleSubmit } = (0, $9pxSs$useForm)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const appendLink = (0, $9pxSs$useCallback)(
    async (objectUri: any) => {
      // Get the freshest data so that the put operation doesn't overwrite anything
      const { data: data } = await dataProvider.getOne(resource, {
        id: subjectUri
      });
      await dataProvider.update(resource, {
        id: subjectUri,
        data: {
          ...data,
          [source]: data[source]
            ? Array.isArray(data[source])
              ? [...data[source], objectUri]
              : [data[source], objectUri]
            : objectUri
        },
        previousData: data
      });
      refresh();
      onClose();
    },
    [dataProvider, subjectUri, resource, source, refresh, onClose]
  );
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const create = (0, $9pxSs$useCallback)(
    async (values: any) => {
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
    },
    [dataProvider, dataModel, appendLink, reference, notify]
  );
  return (
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Dialog), {
      fullWidth: true,
      open: open,
      onClose: onClose,
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      children:
        panel === 'find'
          ? /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$Fragment), {
              children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogTitle), {
                  className: classes.title,
                  children: 'Ajouter une relation'
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogContent), {
                  className: classes.addForm,
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$TextField), {
                    autoFocus: true,
                    label: `Rechercher ou cr\xe9er des ${getResourceLabel(reference, 2).toLowerCase()}`,
                    variant: 'filled',
                    margin: 'dense',
                    value: keyword,
                    onChange: (e: any) => setKeyword(e.target.value),
                    fullWidth: true
                  })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogContent), {
                  className: classes.listForm,
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $6bf8168f746430d4$export$2e2bcd8739ae039), {
                    keyword: keyword,
                    source: source,
                    reference: reference,
                    appendLink: appendLink,
                    switchToCreate: () => {
                      setValue('title', keyword);
                      setPanel('create');
                    }
                  })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogActions), {
                  className: classes.actions,
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Button), {
                    label: 'ra.action.close',
                    variant: 'text',
                    onClick: onClose
                  })
                })
              ]
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            })
          : /*#__PURE__*/ (0, $9pxSs$jsxs)('form', {
              onSubmit: handleSubmit(create),
              children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogTitle), {
                  className: classes.title,
                  children: translate('ra.page.create', {
                    name: getResourceLabel(reference, 1)
                  })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$DialogContent), {
                  className: classes.addForm,
                  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                  children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$TextField), {
                    ...register('title'),
                    autoFocus: true,
                    label: 'Titre',
                    variant: 'filled',
                    margin: 'dense',
                    fullWidth: true
                  })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$DialogActions), {
                  className: classes.actions,
                  children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Button), {
                      label: 'ra.action.create',
                      variant: 'contained',
                      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                      startIcon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialAdd), {}),
                      type: 'submit'
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Button), {
                      label: 'ra.action.close',
                      variant: 'text',
                      onClick: onClose
                    })
                  ]
                })
              ]
            })
    })
  );
};
var $3d5bffcd1289119f$export$2e2bcd8739ae039 = $3d5bffcd1289119f$var$QuickAppendDialog;

// @ts-expect-error TS(7031): Binding element 'reference' implicitly has an 'any... Remove this comment to see the full error message
const $c6e9301cf3cc37bc$var$QuickAppendReferenceArrayField = ({
  reference: reference,
  source: source,
  resource: resource,
  children: children,
  ...otherProps
}) => {
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const [showDialog, setShowDialog] = (0, $9pxSs$useState)(false);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const { permissions: permissions } = (0, $9pxSs$usePermissions)({
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    uri: record.id
  });
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const canAppend = (0, $9pxSs$useMemo)(
    () =>
      !!permissions && permissions.some((p: any) => ['acl:Append', 'acl:Write', 'acl:Control'].includes(p['acl:mode'])),
    [permissions]
  );
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsxs)((0, $9pxSs$Fragment), {
    children: [
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      /*#__PURE__*/ (0, $9pxSs$jsx)((0, $867e5374e5f64b17$export$2e2bcd8739ae039), {
        reference: reference,
        source: source,
        ...otherProps,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children:
          (0, $9pxSs$react).Children.only(children) &&
          /*#__PURE__*/ (0, $9pxSs$react).cloneElement(children, {
            appendLink: canAppend ? () => setShowDialog(true) : undefined
          })
      }),
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      canAppend &&
        showDialog &&
        /*#__PURE__*/ (0, $9pxSs$jsx)((0, $3d5bffcd1289119f$export$2e2bcd8739ae039), {
          open: showDialog,
          onClose: () => setShowDialog(false),
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
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
  'github.com': {
    label: 'GitHub',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialGitHub), {}),
    color: 'black',
    contrastText: 'white'
  },
  'gitlab.com': {
    label: 'GitLab',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$FiGitlab), {}),
    color: 'orange',
    contrastText: 'black'
  },
  'opencollective.com': {
    label: 'Open Collective',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Avatar), {
      component: 'span',
      src: 'https://opencollective.com/static/images/opencollective-icon.svg'
    }),
    color: 'white',
    contrastText: '#297EFF'
  },
  'facebook.com': {
    label: 'Facebook',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialFacebook), {}),
    color: '#4267B2',
    contrastText: 'white'
  },
  'twitter.com': {
    label: 'Twitter',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialTwitter), {}),
    color: '#00ACEE',
    contrastText: 'white'
  },
  'instagram.com': {
    label: 'Instagram',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialInstagram), {}),
    color: '#8a3ab9',
    contrastText: 'white'
  },
  'youtube.com': {
    label: 'YouTube',
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialYouTube), {}),
    color: '#FF0000',
    contrastText: 'white'
  }
};
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $3964a2ca9e598444$var$useStyles = (0, $9pxSs$muistylesmakeStyles)(() => ({
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
const $3964a2ca9e598444$var$MultiUrlField = ({ source: source, domainMapping: domainMapping }) => {
  const newDomainMapping = {
    ...$3964a2ca9e598444$var$defaultdomainMapping,
    ...domainMapping
  };
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const record = (0, $9pxSs$useRecordContext)();
  const classes = $3964a2ca9e598444$var$useStyles();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const urlArray = record[source]
    ? Array.isArray(record[source])
      ? record[source]
      : [
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          record[source]
        ]
    : [];
  return urlArray.map((url: any, index: any) => {
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
      icon: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$muiiconsmaterialLanguage), {}),
      color: '#ea',
      contrastText: 'black'
    };
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $9pxSs$jsx)(
      'a',
      {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: classes.link,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Chip), {
          component: 'span',
          // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
          icon: /*#__PURE__*/ (0, $9pxSs$react).cloneElement(chip.icon, {
            style: {
              color: chip.contrastText,
              width: 18,
              height: 18
            }
          }),
          size: 'small',
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
      },
      index
    );
  });
};
var $3964a2ca9e598444$export$2e2bcd8739ae039 = $3964a2ca9e598444$var$MultiUrlField;

// useful to prevent click bubbling in a datagrid with rowClick
const $ae119a539bc2f2b9$var$stopPropagation = (e: any) => e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $ae119a539bc2f2b9$var$handleClick = () => {};
const $ae119a539bc2f2b9$var$SeparatedListField = (props: any) => {
  let { children: children, link: link = 'edit', linkType: linkType, separator: separator = ',\u00A0' } = props;
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const { data: data, isLoading: isLoading, resource: resource } = (0, $9pxSs$useListContext)(props);
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  const createPath = (0, $9pxSs$useCreatePath)();
  if (linkType !== undefined) {
    console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
    link = linkType;
  }
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  if (isLoading) return /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$LinearProgress), {});
  // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  return /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Fragment), {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    children: data.map((record, i) => {
      if (!record.id) return null;
      const resourceLinkPath =
        link !== false &&
        (typeof link === 'function'
          ? link(record.id)
          : createPath({
              resource: resource,
              id: record.id,
              type: link
            }));
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      if (resourceLinkPath)
        return /*#__PURE__*/ (0, $9pxSs$jsxs)(
          'span',
          {
            children: [
              // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
              /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$Link), {
                to: resourceLinkPath,
                onClick: $ae119a539bc2f2b9$var$stopPropagation,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $9pxSs$cloneElement)((0, $9pxSs$Children).only(children), {
                  // Workaround to force ChipField to be clickable
                  onClick: $ae119a539bc2f2b9$var$handleClick
                })
              }),
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              i < data.length - 1 && separator
            ]
          },
          record.id
        );
      // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
      return /*#__PURE__*/ (0, $9pxSs$jsxs)(
        'span',
        {
          children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $9pxSs$jsx)((0, $9pxSs$RecordContextProvider), {
              value: record,
              children: children
            }),
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            i < data.length - 1 && separator
          ]
        },
        record.id
      );
    })
  });
};
var $ae119a539bc2f2b9$export$2e2bcd8739ae039 = $ae119a539bc2f2b9$var$SeparatedListField;

export {
  $548fb3c4c04d834a$export$2e2bcd8739ae039 as AvatarWithLabelField,
  $867e5374e5f64b17$export$2e2bcd8739ae039 as ReferenceArrayField,
  $e253ae5050c248a7$export$2e2bcd8739ae039 as ReferenceField,
  $c6e9301cf3cc37bc$export$2e2bcd8739ae039 as QuickAppendReferenceArrayField,
  $3964a2ca9e598444$export$2e2bcd8739ae039 as MultiUrlField,
  $ae119a539bc2f2b9$export$2e2bcd8739ae039 as SeparatedListField
};
//# sourceMappingURL=index.es.js.map
