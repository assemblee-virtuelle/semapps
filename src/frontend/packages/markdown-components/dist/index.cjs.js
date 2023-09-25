var $lSzTu$reactjsxdevruntime = require("react/jsx-dev-runtime");
var $lSzTu$react = require("react");
var $lSzTu$reactadmin = require("react-admin");
var $lSzTu$markdowntojsx = require("markdown-to-jsx");
var $lSzTu$lodashget = require("lodash/get");
var $lSzTu$reactmde = require("react-mde");
var $lSzTu$muimaterial = require("@mui/material");
var $lSzTu$muisystem = require("@mui/system");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "MarkdownField", () => $e77dbe0cc63a4759$exports.default);
$parcel$export(module.exports, "MarkdownInput", () => $014faea72789ebc1$exports.default);
$parcel$export(module.exports, "useLoadLinks", () => $111c9a4f9553dc9d$export$2e2bcd8739ae039);
var $e77dbe0cc63a4759$exports = {};

$parcel$export($e77dbe0cc63a4759$exports, "default", () => $e77dbe0cc63a4759$export$2e2bcd8739ae039);





const $e77dbe0cc63a4759$var$MarkdownField = ({ source: source, LabelComponent: LabelComponent, overrides: overrides = {}, ...rest })=>{
    const record = (0, $lSzTu$reactadmin.useRecordContext)();
    if (!record || !(0, ($parcel$interopDefault($lSzTu$lodashget)))(record, source)) return null;
    return /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, ($parcel$interopDefault($lSzTu$markdowntojsx))), {
        options: {
            createElement (type, props, children) {
                if (props.label) return /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, $lSzTu$reactjsxdevruntime.Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)(LabelComponent, {
                            children: props.label
                        }, void 0, false, void 0, void 0),
                        /*#__PURE__*/ (0, ($parcel$interopDefault($lSzTu$react))).createElement(type, props, children)
                    ]
                }, void 0, true);
                return /*#__PURE__*/ (0, ($parcel$interopDefault($lSzTu$react))).createElement(type, props, children);
            },
            overrides: {
                h1: LabelComponent,
                ...overrides
            },
            ...rest
        },
        children: (0, ($parcel$interopDefault($lSzTu$lodashget)))(record, source)
    }, void 0, false, {
        fileName: "packages/markdown-components/src/MarkdownField.js",
        lineNumber: 11,
        columnNumber: 5
    }, undefined);
};
$e77dbe0cc63a4759$var$MarkdownField.defaultProps = {
    LabelComponent: "h2"
};
var $e77dbe0cc63a4759$export$2e2bcd8739ae039 = $e77dbe0cc63a4759$var$MarkdownField;


var $014faea72789ebc1$exports = {};

$parcel$export($014faea72789ebc1$exports, "default", () => $014faea72789ebc1$export$2e2bcd8739ae039);







const $014faea72789ebc1$var$StyledFormControl = (0, $lSzTu$muisystem.styled)((0, $lSzTu$muimaterial.FormControl))(({ theme: theme })=>({
        "&.validationError": {
            "& p": {
                color: theme.palette.error.main
            },
            "& .mde-text": {
                outline: "-webkit-focus-ring-color auto 1px",
                outlineOffset: 0,
                outlineColor: theme.palette.error.main,
                outlineStyle: "auto",
                outlineWidth: 1
            },
            "& p.MuiFormHelperText-root": {
                color: theme.palette.error.main
            }
        }
    }));
const $014faea72789ebc1$var$MarkdownInput = (props)=>{
    const { validate: validate } = props;
    const isRequired = (0, $lSzTu$react.useMemo)(()=>!!validate && !![].concat(validate).find((v)=>v.toString() === (0, $lSzTu$reactadmin.required)().toString()), [
        validate
    ]);
    const [tab, setTab] = (0, $lSzTu$react.useState)("write");
    const { field: { value: value, onChange: onChange }, fieldState: { isDirty: isDirty, invalid: invalid, error: error, isTouched: isTouched } } = (0, $lSzTu$reactadmin.useInput)(props);
    return /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)($014faea72789ebc1$var$StyledFormControl, {
        fullWidth: true,
        className: `ra-input-mde ${invalid ? "validationError" : ""}`,
        children: [
            /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, $lSzTu$reactadmin.Labeled), {
                ...props,
                isRequired: isRequired,
                children: /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, ($parcel$interopDefault($lSzTu$reactmde))), {
                    value: value,
                    onChange: (value)=>onChange(value),
                    onTabChange: (tab)=>setTab(tab),
                    generateMarkdownPreview: async (markdown)=>/*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, ($parcel$interopDefault($lSzTu$markdowntojsx))), {
                            children: markdown
                        }, void 0, false, void 0, void 0),
                    selectedTab: tab,
                    ...props
                }, void 0, false, {
                    fileName: "packages/markdown-components/src/MarkdownInput.js",
                    lineNumber: 41,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/markdown-components/src/MarkdownInput.js",
                lineNumber: 40,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, $lSzTu$muimaterial.FormHelperText), {
                error: isDirty && invalid,
                margin: "dense",
                variant: "outlined",
                children: /*#__PURE__*/ (0, $lSzTu$reactjsxdevruntime.jsxDEV)((0, $lSzTu$reactadmin.InputHelperText), {
                    error: isDirty && invalid && error,
                    helperText: props.helperText,
                    touched: error || isTouched
                }, void 0, false, {
                    fileName: "packages/markdown-components/src/MarkdownInput.js",
                    lineNumber: 51,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/markdown-components/src/MarkdownInput.js",
                lineNumber: 50,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/markdown-components/src/MarkdownInput.js",
        lineNumber: 39,
        columnNumber: 5
    }, undefined);
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
