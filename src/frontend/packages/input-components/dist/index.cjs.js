var $3asgq$reactjsxruntime = require("react/jsx-runtime");
var $3asgq$reactadmin = require("react-admin");
var $3asgq$react = require("react");
var $3asgq$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $3asgq$reacthookform = require("react-hook-form");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "ImageInput", () => $cdabe6ba421df206$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiServerAutocompleteArrayInput", () => $d3e2e3d630c79213$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiServerAutocompleteInput", () => $c7bb340c6cd07d6a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiLinesInput", () => $37456f889a58747f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceArrayInput", () => $90eab1227e899a49$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceInput", () => $4202119289255271$export$2e2bcd8739ae039);
/* eslint-disable react/react-in-jsx-scope */ 

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const $cdabe6ba421df206$var$transformFile = (file)=>{
    const preview = URL.createObjectURL(file);
    return {
        rawFile: file,
        src: preview,
        title: file.name
    };
};
const $cdabe6ba421df206$var$format = (v)=>{
    if (typeof v === 'string') return {
        src: v
    };
    if (Array.isArray(v)) return v.map((e)=>typeof e === 'string' ? {
            src: e
        } : e);
    return v;
};
const $cdabe6ba421df206$var$parse = (v)=>{
    if (Array.isArray(v)) return v.map((e)=>$cdabe6ba421df206$var$parse(e));
    if (v instanceof File) return $cdabe6ba421df206$var$transformFile(v);
    if (v?.src && !('rawFile' in v)) return v.src;
    return v;
};
const $cdabe6ba421df206$var$ImageInput = ({ source: source, ...otherProps })=>{
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ImageInput), {
        source: source,
        format: $cdabe6ba421df206$var$format,
        parse: $cdabe6ba421df206$var$parse,
        ...otherProps
    });
};
var $cdabe6ba421df206$export$2e2bcd8739ae039 = $cdabe6ba421df206$var$ImageInput;









const $db06f27b57b80fcf$var$OptionRenderer = ({ optionText: optionText, dataServers: dataServers })=>{
    const record = (0, $3asgq$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const server = dataServers && Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsxs)("span", {
        children: [
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            record[optionText],
            server && /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsxs)("em", {
                className: "serverName",
                style: {
                    color: 'grey'
                },
                children: [
                    "\xa0(",
                    server.name,
                    ")"
                ]
            })
        ]
    });
};
var $db06f27b57b80fcf$export$2e2bcd8739ae039 = $db06f27b57b80fcf$var$OptionRenderer;


const $d3e2e3d630c79213$var$MultiServerAutocompleteArrayInput = ({ optionText: optionText, ...rest })=>{
    const dataServers = (0, $3asgq$semappssemanticdataprovider.useDataServers)();
    const matchSuggestion = (0, $3asgq$react.useCallback)((filterValue, choice)=>choice[optionText].toLowerCase().match(filterValue.toLowerCase()), [
        optionText
    ]);
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.AutocompleteArrayInput), {
        matchSuggestion: matchSuggestion,
        optionText: /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $db06f27b57b80fcf$export$2e2bcd8739ae039), {
            optionText: optionText,
            dataServers: dataServers
        }),
        inputText: (choice)=>choice[optionText],
        ...rest
    });
};
var $d3e2e3d630c79213$export$2e2bcd8739ae039 = $d3e2e3d630c79213$var$MultiServerAutocompleteArrayInput;






const $c7bb340c6cd07d6a$var$MultiServerAutocompleteInput = ({ optionText: optionText, ...rest })=>{
    const dataServers = (0, $3asgq$semappssemanticdataprovider.useDataServers)();
    // We cannot use OptionRenderer like MultiServerAutocompleteArrayInput because there is a bug with AutocompleteInput
    const optionTextWithServerName = (0, $3asgq$react.useCallback)((record)=>{
        if (record && dataServers) {
            const server = Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
            return record[optionText] + (server ? ` (${server.name})` : '');
        }
    }, [
        optionText,
        dataServers
    ]);
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.AutocompleteInput), {
        optionText: optionTextWithServerName,
        ...rest
    });
};
var $c7bb340c6cd07d6a$export$2e2bcd8739ae039 = $c7bb340c6cd07d6a$var$MultiServerAutocompleteInput;





const $37456f889a58747f$var$MultiLinesInput = (props)=>/*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.TextInput), {
        multiline: true,
        minRows: 2,
        format: (value)=>value ? Array.isArray(value) ? value.join('\n') : value : '',
        parse: (value)=>value.split(/\r?\n/),
        ...props
    });
var $37456f889a58747f$export$2e2bcd8739ae039 = $37456f889a58747f$var$MultiLinesInput;






const $90eab1227e899a49$var$ReferenceArrayInput = (props)=>{
    const { field: { value: value, onChange: onChange } } = (0, $3asgq$reacthookform.useController)({
        name: props.source
    });
    (0, $3asgq$react.useEffect)(()=>{
        if (value && !Array.isArray(value)) onChange([
            value
        ]);
    }, [
        value,
        onChange
    ]);
    // Wait for change to be effective before rendering component
    // Otherwise it will be wrongly initialized and it won't work
    if (value && !Array.isArray(value)) return null;
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ReferenceArrayInput), {
        ...props
    });
};
var $90eab1227e899a49$export$2e2bcd8739ae039 = $90eab1227e899a49$var$ReferenceArrayInput;





const $4202119289255271$var$format = (value)=>{
    // If there is no value, return immediately
    if (!value) return value;
    // If the value is an object with an @id field, return the uri
    return typeof value === 'object' ? value.id || value['@id'] : value;
};
const $4202119289255271$var$ReferenceInput = ({ children: children, ...rest })=>{
    const child = (0, ($parcel$interopDefault($3asgq$react))).Children.only(children);
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ReferenceInput), {
        ...rest,
        children: /*#__PURE__*/ (0, ($parcel$interopDefault($3asgq$react))).cloneElement(child, {
            format: $4202119289255271$var$format
        })
    });
};
var $4202119289255271$export$2e2bcd8739ae039 = $4202119289255271$var$ReferenceInput;




//# sourceMappingURL=index.cjs.js.map
