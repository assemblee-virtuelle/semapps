var $7rG7r$reactjsxruntime = require("react/jsx-runtime");
var $7rG7r$react = require("react");
var $7rG7r$reactadmin = require("react-admin");
var $7rG7r$markdowntojsx = require("markdown-to-jsx");
var $7rG7r$lodashget = require("lodash/get");
var $7rG7r$reactmde = require("react-mde");
var $7rG7r$muimaterial = require("@mui/material");
var $7rG7r$muimaterialstyles = require("@mui/material/styles");


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MarkdownField", () => $e77dbe0cc63a4759$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MarkdownInput", () => $ce99d4a9167fa213$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "useLoadLinks", () => $111c9a4f9553dc9d$export$2e2bcd8739ae039);





// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $e77dbe0cc63a4759$var$MarkdownField = ({ source: source, LabelComponent: LabelComponent = 'h2', overrides: overrides = {}, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $7rG7r$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    if (!record || !(0, ($parcel$interopDefault($7rG7r$lodashget)))(record, source)) return null;
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$markdowntojsx))), {
            options: {
                createElement (type: any, props: any, children: any) {
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    if (props.label) return /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)((0, $7rG7r$reactjsxruntime.Fragment), {
                        children: [
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)(LabelComponent, {
                                children: props.label
                            }),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /*#__PURE__*/ (0, ($parcel$interopDefault($7rG7r$react))).createElement(type, props, children)
                        ]
                    });
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    return /*#__PURE__*/ (0, ($parcel$interopDefault($7rG7r$react))).createElement(type, props, children);
                },
                overrides: {
                    h1: LabelComponent,
                    ...overrides
                },
                ...rest
            },
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            children: (0, ($parcel$interopDefault($7rG7r$lodashget)))(record, source)
        })
    );
};
var $e77dbe0cc63a4759$export$2e2bcd8739ae039 = $e77dbe0cc63a4759$var$MarkdownField;


/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */ 






// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
const $ce99d4a9167fa213$var$MarkdownInput = (props: any) => {
    const { label: label, source: source, helperText: helperText, fullWidth: fullWidth, validate: validate, overrides: overrides, reactMdeProps: reactMdeProps } = props;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [tab, setTab] = (0, $7rG7r$react.useState)('write');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange }, fieldState: { isDirty: isDirty, invalid: invalid, error: error, isTouched: isTouched }, formState: { isSubmitted: isSubmitted }, isRequired: isRequired } = (0, $7rG7r$reactadmin.useInput)({
        source: source,
        validate: validate
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translateLabel = (0, $7rG7r$reactadmin.useTranslateLabel)();
    const translatedLabel = `${translateLabel({
        label: label,
        source: source
    })}${isRequired ? '*' : ''}`;
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)($ce99d4a9167fa213$var$StyledFormControl, {
            fullWidth: fullWidth,
            className: `${invalid ? 'validationError' : ''} ${value === '' ? 'empty' : ''}`,
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsxs)("fieldset", {
                    children: [
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)("legend", {
                            children: translatedLabel
                        }),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$reactmde))), {
                            value: value,
                            onChange: (val: any) => onChange(val),
                            onTabChange: (newTab: any) => setTab(newTab),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            /* eslint-disable-next-line react/no-unstable-nested-components */ generateMarkdownPreview: async (markdown: any) => /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, ($parcel$interopDefault($7rG7r$markdowntojsx))), {
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
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, $7rG7r$muimaterial.FormHelperText), {
                    error: isDirty && invalid,
                    margin: "dense",
                    variant: "outlined",
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $7rG7r$reactjsxruntime.jsx)((0, $7rG7r$reactadmin.InputHelperText), {
                        error: error?.message,
                        helperText: helperText,
                        touched: isTouched || isSubmitted
                    })
                })
            ]
        })
    );
};
var $ce99d4a9167fa213$export$2e2bcd8739ae039 = $ce99d4a9167fa213$var$MarkdownInput;



const $111c9a4f9553dc9d$var$useLoadLinks = (resourceType: any, labelProp: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $7rG7r$reactadmin.useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $7rG7r$reactadmin.useTranslate)();
    return async (keyword: any) => {
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
            if (results.total > 0) return results.data.map((record: any) => ({
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
var $111c9a4f9553dc9d$export$2e2bcd8739ae039 = $111c9a4f9553dc9d$var$useLoadLinks;




//# sourceMappingURL=index.cjs.js.map
