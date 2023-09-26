var $lSzTu$reactjsxruntime = require("react/jsx-runtime");
var $lSzTu$react = require("react");
var $lSzTu$reactadmin = require("react-admin");
var $lSzTu$markdowntojsx = require("markdown-to-jsx");
var $lSzTu$lodashget = require("lodash/get");
var $lSzTu$reactmde = require("react-mde");
var $lSzTu$muimaterial = require("@mui/material");
var $lSzTu$muimaterialstyles = require("@mui/material/styles");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "MarkdownField", () => $e77dbe0cc63a4759$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MarkdownInput", () => $014faea72789ebc1$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useLoadLinks", () => $111c9a4f9553dc9d$export$2e2bcd8739ae039);





const $e77dbe0cc63a4759$var$MarkdownField = ({ source: source, LabelComponent: LabelComponent, overrides: overrides = {}, ...rest })=>{
    const record = (0, $lSzTu$reactadmin.useRecordContext)();
    if (!record || !(0, ($parcel$interopDefault($lSzTu$lodashget)))(record, source)) return null;
    return /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)((0, ($parcel$interopDefault($lSzTu$markdowntojsx))), {
        options: {
            createElement (type, props, children) {
                if (props.label) return /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsxs)((0, $lSzTu$reactjsxruntime.Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)(LabelComponent, {
                            children: props.label
                        }),
                        /*#__PURE__*/ (0, ($parcel$interopDefault($lSzTu$react))).createElement(type, props, children)
                    ]
                });
                return /*#__PURE__*/ (0, ($parcel$interopDefault($lSzTu$react))).createElement(type, props, children);
            },
            overrides: {
                h1: LabelComponent,
                ...overrides
            },
            ...rest
        },
        children: (0, ($parcel$interopDefault($lSzTu$lodashget)))(record, source)
    });
};
$e77dbe0cc63a4759$var$MarkdownField.defaultProps = {
    LabelComponent: "h2"
};
var $e77dbe0cc63a4759$export$2e2bcd8739ae039 = $e77dbe0cc63a4759$var$MarkdownField;









const $014faea72789ebc1$var$StyledFormControl = (0, $lSzTu$muimaterialstyles.styled)((0, $lSzTu$muimaterial.FormControl))(({ theme: theme })=>({
        "& > fieldset": {
            borderWidth: 1,
            borderStyle: "solid",
            padding: 0,
            borderRadius: theme.shape.borderRadius,
            margin: 1
        },
        "& > fieldset:hover": {
            borderColor: theme.palette.text.primary
        },
        "& > fieldset:focus-within": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
            marginLeft: 0
        },
        "& > fieldset > legend": {
            color: theme.palette.text.secondary,
            marginLeft: 10,
            fontSize: theme.typography.caption.fontSize
        },
        "& > fieldset:focus-within > legend": {
            color: theme.palette.primary.main
        },
        "& .react-mde": {
            borderWidth: 0,
            borderRadius: theme.shape.borderRadius,
            marginTop: -5
        },
        "& .mde-header": {
            background: "transparent"
        },
        "& .mde-text:focus": {
            outline: "none"
        },
        "& .mde-text:focus::placeholder": {
            color: "transparent"
        },
        "&.empty": {
            "& > fieldset": {
                paddingTop: 10,
                marginTop: 9
            },
            "& > fieldset:focus-within": {
                paddingTop: 0,
                margin: 0,
                marginTop: 1
            },
            "& > fieldset > legend": {
                display: "none"
            },
            "& > fieldset:focus-within > legend": {
                display: "block"
            }
        },
        "&.validationError": {
            "& > fieldset": {
                borderColor: theme.palette.error.main
            },
            "& > fieldset > legend, & .mde-text::placeholder": {
                color: theme.palette.error.main
            },
            "& .mde-text:focus::placeholder": {
                color: "transparent"
            },
            "& p.MuiFormHelperText-root": {
                color: theme.palette.error.main
            }
        }
    }));
const $014faea72789ebc1$var$MarkdownInput = (props)=>{
    const { label: label, source: source, helperText: helperText, fullWidth: fullWidth, validate: validate, overrides: overrides, reactMdeProps: reactMdeProps } = props;
    const [tab, setTab] = (0, $lSzTu$react.useState) < "write" | false;
    const { field: { value: value, onChange: onChange }, fieldState: { isDirty: isDirty, invalid: invalid, error: error, isTouched: isTouched }, formState: { isSubmitted: isSubmitted }, isRequired: isRequired } = (0, $lSzTu$reactadmin.useInput)({
        source: source,
        validate: validate
    });
    const translateLabel = (0, $lSzTu$reactadmin.useTranslateLabel)();
    const translatedLabel = `${translateLabel({
        label: label,
        source: source
    })}${isRequired ? "*" : ""}`;
    return /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsxs)($014faea72789ebc1$var$StyledFormControl, {
        fullWidth: fullWidth,
        className: `${invalid ? "validationError" : ""} ${value === "" ? "empty" : ""}`,
        children: [
            /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsxs)("fieldset", {
                children: [
                    /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)("legend", {
                        children: translatedLabel
                    }),
                    /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)((0, ($parcel$interopDefault($lSzTu$reactmde))), {
                        value: value,
                        onChange: (value)=>onChange(value),
                        onTabChange: (tab)=>setTab(tab),
                        generateMarkdownPreview: async (markdown)=>/*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)((0, ($parcel$interopDefault($lSzTu$markdowntojsx))), {
                                options: {
                                    overrides: overrides
                                },
                                children: markdown
                            }),
                        selectedTab: tab,
                        childProps: {
                            textArea: {
                                placeholder: translatedLabel
                            }
                        },
                        l18n: {
                            write: "Saisie",
                            preview: "Pr\xe9visualisation",
                            uploadingImage: "Upload de l'image en cours...",
                            pasteDropSelect: "Ajoutez des fichiers en les glissant dans la zone de saisie"
                        },
                        ...reactMdeProps
                    })
                ]
            }),
            /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)((0, $lSzTu$muimaterial.FormHelperText), {
                error: isDirty && invalid,
                margin: "dense",
                variant: "outlined",
                children: /*#__PURE__*/ (0, $lSzTu$reactjsxruntime.jsx)((0, $lSzTu$reactadmin.InputHelperText), {
                    error: error?.message,
                    helperText: helperText,
                    touched: isTouched || isSubmitted
                })
            })
        ]
    });
};
var $014faea72789ebc1$export$2e2bcd8739ae039 = $014faea72789ebc1$var$MarkdownInput;



const $111c9a4f9553dc9d$var$useLoadLinks = (resourceType, labelProp)=>{
    const dataProvider = (0, $lSzTu$reactadmin.useDataProvider)();
    const translate = (0, $lSzTu$reactadmin.useTranslate)();
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
            if (results.total > 0) return results.data.map((record)=>({
                    preview: record[labelProp],
                    value: `[${record[labelProp]}](/${resourceType}/${encodeURIComponent(record.id)}/show)`
                }));
            return [
                {
                    preview: translate("ra.navigation.no_results"),
                    value: `[${keyword}`
                }
            ];
        }
        return [
            {
                preview: translate("ra.action.search"),
                value: `[${keyword}`
            }
        ];
    };
};
var $111c9a4f9553dc9d$export$2e2bcd8739ae039 = $111c9a4f9553dc9d$var$useLoadLinks;




//# sourceMappingURL=index.cjs.js.map
