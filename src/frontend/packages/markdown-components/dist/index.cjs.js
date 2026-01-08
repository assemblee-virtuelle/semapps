var $7rG7r$reactjsxruntime = require("react/jsx-runtime");
var $7rG7r$react = require("react");
var $7rG7r$reactadmin = require("react-admin");
var $7rG7r$markdowntojsx = require("markdown-to-jsx");
var $7rG7r$lodashget = require("lodash/get");
var $7rG7r$reactmde = require("react-mde");
var $7rG7r$muimaterial = require("@mui/material");
var $7rG7r$muimaterialstyles = require("@mui/material/styles");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "MarkdownField", () => $2dd2ecd07e40a181$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MarkdownInput", () => $ce99d4a9167fa213$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useLoadLinks", () => $a31f63d8cf86d3e7$export$2e2bcd8739ae039);





const $2dd2ecd07e40a181$var$MarkdownField = ({ source: source, LabelComponent: LabelComponent = 'h2', overrides: overrides = {}, ...rest })=>{
    const record = (0, $7rG7r$reactadmin.useRecordContext)();
    if (!record || !(0, ($parcel$interopDefault($7rG7r$lodashget)))(record, source)) return null;
    return /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$markdowntojsx))), {
        options: {
            createElement (type, props, children) {
                // @ts-expect-error TS(2339): Property 'label' does not exist on type 'Intrinsic... Remove this comment to see the full error message
                if (props.label) return /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)((0, $7rG7r$reactjsxruntime.Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)(LabelComponent, {
                            children: // @ts-expect-error TS(2339): Property 'label' does not exist on type 'Intrinsic... Remove this comment to see the full error message
                            props.label
                        }),
                        /*#__PURE__*/ (0, ($parcel$interopDefault($7rG7r$react))).createElement(type, props, children)
                    ]
                });
                return /*#__PURE__*/ (0, ($parcel$interopDefault($7rG7r$react))).createElement(type, props, children);
            },
            overrides: {
                h1: LabelComponent,
                ...overrides
            },
            ...rest
        },
        children: (0, ($parcel$interopDefault($7rG7r$lodashget)))(record, source)
    });
};
var $2dd2ecd07e40a181$export$2e2bcd8739ae039 = $2dd2ecd07e40a181$var$MarkdownField;


/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */ 






const $ce99d4a9167fa213$var$StyledFormControl = (0, $7rG7r$muimaterialstyles.styled)((0, $7rG7r$muimaterial.FormControl))(({ theme: theme })=>({
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
const $ce99d4a9167fa213$var$MarkdownInput = (props)=>{
    const { label: label, source: source, helperText: helperText, fullWidth: fullWidth, validate: validate, overrides: overrides, reactMdeProps: reactMdeProps } = props;
    const [tab, setTab] = (0, $7rG7r$react.useState)('write');
    const { field: { value: value, onChange: onChange }, fieldState: { isDirty: isDirty, invalid: invalid, error: error, isTouched: isTouched }, formState: { isSubmitted: isSubmitted }, isRequired: isRequired } = (0, $7rG7r$reactadmin.useInput)({
        source: source,
        validate: validate
    });
    const translateLabel = (0, $7rG7r$reactadmin.useTranslateLabel)();
    const translatedLabel = `${translateLabel({
        label: label,
        source: source
    })}${isRequired ? '*' : ''}`;
    return /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)($ce99d4a9167fa213$var$StyledFormControl, {
        fullWidth: fullWidth,
        className: `${invalid ? 'validationError' : ''} ${value === '' ? 'empty' : ''}`,
        children: [
            /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)("fieldset", {
                children: [
                    /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)("legend", {
                        children: translatedLabel
                    }),
                    /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$reactmde))), {
                        value: value,
                        onChange: (val)=>onChange(val),
                        onTabChange: (newTab)=>setTab(newTab),
                        /* eslint-disable-next-line react/no-unstable-nested-components */ generateMarkdownPreview: async (markdown)=>/*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$markdowntojsx))), {
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
            /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, $7rG7r$muimaterial.FormHelperText), {
                error: isDirty && invalid,
                margin: "dense",
                variant: "outlined",
                children: /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, $7rG7r$reactadmin.InputHelperText), {
                    error: error?.message,
                    helperText: helperText,
                    // @ts-expect-error TS(2322): Type '{ error: string | undefined; helperText: str... Remove this comment to see the full error message
                    touched: isTouched || isSubmitted
                })
            })
        ]
    });
};
var $ce99d4a9167fa213$export$2e2bcd8739ae039 = $ce99d4a9167fa213$var$MarkdownInput;



const $a31f63d8cf86d3e7$var$useLoadLinks = (resourceType, labelProp)=>{
    const dataProvider = (0, $7rG7r$reactadmin.useDataProvider)();
    const translate = (0, $7rG7r$reactadmin.useTranslate)();
    return async (keyword)=>{
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
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (results.total > 0) return results.data.map((record)=>({
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
var $a31f63d8cf86d3e7$export$2e2bcd8739ae039 = $a31f63d8cf86d3e7$var$useLoadLinks;




//# sourceMappingURL=index.cjs.js.map
