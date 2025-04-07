import { jsx as $kkR1A$jsx, jsxs as $kkR1A$jsxs, Fragment as $kkR1A$Fragment } from 'react/jsx-runtime';
import $kkR1A$react, { useState as $kkR1A$useState } from 'react';
import {
  useRecordContext as $kkR1A$useRecordContext,
  useInput as $kkR1A$useInput,
  useTranslateLabel as $kkR1A$useTranslateLabel,
  InputHelperText as $kkR1A$InputHelperText,
  useDataProvider as $kkR1A$useDataProvider,
  useTranslate as $kkR1A$useTranslate
} from 'react-admin';
import $kkR1A$markdowntojsx from 'markdown-to-jsx';
import $kkR1A$lodashget from 'lodash/get';
import $kkR1A$reactmde from 'react-mde';
import { FormControl as $kkR1A$FormControl, FormHelperText as $kkR1A$FormHelperText } from '@mui/material';
import { styled as $kkR1A$styled } from '@mui/material/styles';

const $cf6ed0ef7f5d4af7$var$MarkdownField = ({
  source: source,
  LabelComponent: LabelComponent = 'h2',
  overrides: overrides = {},
  ...rest
}) => {
  const record = (0, $kkR1A$useRecordContext)();
  if (!record || !(0, $kkR1A$lodashget)(record, source)) return null;
  return /*#__PURE__*/ (0, $kkR1A$jsx)((0, $kkR1A$markdowntojsx), {
    options: {
      createElement(type, props, children) {
        if (props.label)
          return /*#__PURE__*/ (0, $kkR1A$jsxs)((0, $kkR1A$Fragment), {
            children: [
              /*#__PURE__*/ (0, $kkR1A$jsx)(LabelComponent, {
                children: props.label
              }),
              /*#__PURE__*/ (0, $kkR1A$react).createElement(type, props, children)
            ]
          });
        return /*#__PURE__*/ (0, $kkR1A$react).createElement(type, props, children);
      },
      overrides: {
        h1: LabelComponent,
        ...overrides
      },
      ...rest
    },
    children: (0, $kkR1A$lodashget)(record, source)
  });
};
var $cf6ed0ef7f5d4af7$export$2e2bcd8739ae039 = $cf6ed0ef7f5d4af7$var$MarkdownField;

/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */

const $ece2092e88263cda$var$StyledFormControl = (0, $kkR1A$styled)((0, $kkR1A$FormControl))(({ theme: theme }) => ({
  '& > fieldset': {
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 0,
    borderRadius: theme.shape.borderRadius,
    margin: 1
  },
  '& > fieldset:hover': {
    borderColor: theme.palette.text.primary
  },
  '& > fieldset:focus-within': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    marginLeft: 0
  },
  '& > fieldset > legend': {
    color: theme.palette.text.secondary,
    marginLeft: 10,
    fontSize: theme.typography.caption.fontSize
  },
  '& > fieldset:focus-within > legend': {
    color: theme.palette.primary.main
  },
  '& .react-mde': {
    borderWidth: 0,
    borderRadius: theme.shape.borderRadius,
    marginTop: -5
  },
  '& .mde-header': {
    background: 'transparent'
  },
  '& .mde-text:focus': {
    outline: 'none'
  },
  '& .mde-text:focus::placeholder': {
    color: 'transparent'
  },
  '&.empty': {
    '& > fieldset': {
      paddingTop: 10,
      marginTop: 9
    },
    '& > fieldset:focus-within': {
      paddingTop: 0,
      margin: 0,
      marginTop: 1
    },
    '& > fieldset > legend': {
      display: 'none'
    },
    '& > fieldset:focus-within > legend': {
      display: 'block'
    }
  },
  '&.validationError': {
    '& > fieldset': {
      borderColor: theme.palette.error.main
    },
    '& > fieldset > legend, & .mde-text::placeholder': {
      color: theme.palette.error.main
    },
    '& .mde-text:focus::placeholder': {
      color: 'transparent'
    },
    '& p.MuiFormHelperText-root': {
      color: theme.palette.error.main
    }
  }
}));
const $ece2092e88263cda$var$MarkdownInput = props => {
  const {
    label: label,
    source: source,
    helperText: helperText,
    fullWidth: fullWidth,
    validate: validate,
    overrides: overrides,
    reactMdeProps: reactMdeProps
  } = props;
  const [tab, setTab] = (0, $kkR1A$useState)('write');
  const {
    field: { value: value, onChange: onChange },
    fieldState: { isDirty: isDirty, invalid: invalid, error: error, isTouched: isTouched },
    formState: { isSubmitted: isSubmitted },
    isRequired: isRequired
  } = (0, $kkR1A$useInput)({
    source: source,
    validate: validate
  });
  const translateLabel = (0, $kkR1A$useTranslateLabel)();
  const translatedLabel = `${translateLabel({
    label: label,
    source: source
  })}${isRequired ? '*' : ''}`;
  return /*#__PURE__*/ (0, $kkR1A$jsxs)($ece2092e88263cda$var$StyledFormControl, {
    fullWidth: fullWidth,
    className: `${invalid ? 'validationError' : ''} ${value === '' ? 'empty' : ''}`,
    children: [
      /*#__PURE__*/ (0, $kkR1A$jsxs)('fieldset', {
        children: [
          /*#__PURE__*/ (0, $kkR1A$jsx)('legend', {
            children: translatedLabel
          }),
          /*#__PURE__*/ (0, $kkR1A$jsx)((0, $kkR1A$reactmde), {
            value: value,
            onChange: val => onChange(val),
            onTabChange: newTab => setTab(newTab),
            /* eslint-disable-next-line react/no-unstable-nested-components */ generateMarkdownPreview:
              async markdown =>
                /*#__PURE__*/ (0, $kkR1A$jsx)((0, $kkR1A$markdowntojsx), {
                  options: {
                    overrides: overrides || {}
                  },
                  children: markdown
                }),
            selectedTab: tab,
            childProps: {
              textArea: {
                placeholder: translatedLabel
              }
            },
            ...reactMdeProps
          })
        ]
      }),
      /*#__PURE__*/ (0, $kkR1A$jsx)((0, $kkR1A$FormHelperText), {
        error: isDirty && invalid,
        margin: 'dense',
        variant: 'outlined',
        children: /*#__PURE__*/ (0, $kkR1A$jsx)((0, $kkR1A$InputHelperText), {
          error: error?.message,
          helperText: helperText,
          touched: isTouched || isSubmitted
        })
      })
    ]
  });
};
var $ece2092e88263cda$export$2e2bcd8739ae039 = $ece2092e88263cda$var$MarkdownInput;

const $c57f5824f8ba8f82$var$useLoadLinks = (resourceType, labelProp) => {
  const dataProvider = (0, $kkR1A$useDataProvider)();
  const translate = (0, $kkR1A$useTranslate)();
  return async keyword => {
    if (keyword) {
      const results = await dataProvider.getList(resourceType, {
        pagination: {
          page: 1,
          perPage: 5
        },
        filter: {
          q: keyword
        }
      });
      if (results.total > 0)
        return results.data.map(record => ({
          preview: record[labelProp],
          value: `[${record[labelProp]}](/${resourceType}/${encodeURIComponent(record.id)}/show)`
        }));
      return [
        {
          preview: translate('ra.navigation.no_results'),
          value: `[${keyword}`
        }
      ];
    }
    return [
      {
        preview: translate('ra.action.search'),
        value: `[${keyword}`
      }
    ];
  };
};
var $c57f5824f8ba8f82$export$2e2bcd8739ae039 = $c57f5824f8ba8f82$var$useLoadLinks;

export {
  $cf6ed0ef7f5d4af7$export$2e2bcd8739ae039 as MarkdownField,
  $ece2092e88263cda$export$2e2bcd8739ae039 as MarkdownInput,
  $c57f5824f8ba8f82$export$2e2bcd8739ae039 as useLoadLinks
};
//# sourceMappingURL=index.es.js.map
