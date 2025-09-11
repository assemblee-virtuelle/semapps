var $3asgq$reactjsxruntime = require("react/jsx-runtime");
var $3asgq$reactadmin = require("react-admin");
var $3asgq$react = require("react");
var $3asgq$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $3asgq$reacthookform = require("react-hook-form");


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ImageInput", () => $cdabe6ba421df206$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MultiServerAutocompleteArrayInput", () => $bb612fb8f67b03e0$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MultiServerAutocompleteInput", () => $6c505c4dc3e51ff8$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MultiLinesInput", () => $9aa37fe333ef760c$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ReferenceArrayInput", () => $83ac3fff69969204$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ReferenceInput", () => $6fb40d62998d2ee1$export$2e2bcd8739ae039);
/* eslint-disable react/react-in-jsx-scope */ 

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const $cdabe6ba421df206$var$transformFile = (file: any) => {
    const preview = URL.createObjectURL(file);
    return {
        rawFile: file,
        src: preview,
        title: file.name
    };
};
const $cdabe6ba421df206$var$format = (v: any) => {
    if (typeof v === 'string') return {
        src: v
    };
    if (Array.isArray(v)) return v.map((e)=>typeof e === 'string' ? {
            src: e
        } : e);
    return v;
};
// @ts-expect-error TS(7023): '$cdabe6ba421df206$var$parse' implicitly has retur... Remove this comment to see the full error message
const $cdabe6ba421df206$var$parse = (v: any) => {
    if (Array.isArray(v)) return v.map((e)=>$cdabe6ba421df206$var$parse(e));
    if (v instanceof File) return $cdabe6ba421df206$var$transformFile(v);
    if (v?.src && !('rawFile' in v)) return v.src;
    return v;
};
// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $cdabe6ba421df206$var$ImageInput = ({ source: source, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ImageInput), {
        source: source,
        format: $cdabe6ba421df206$var$format,
        parse: $cdabe6ba421df206$var$parse,
        ...otherProps
    });
};
var $cdabe6ba421df206$export$2e2bcd8739ae039 = $cdabe6ba421df206$var$ImageInput;









// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $a3ccd82fa8860009$var$OptionRenderer = ({ optionText: optionText, dataServers: dataServers })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $3asgq$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    const server = dataServers && Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsxs)("span", {
        children: [
            record[optionText],
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
var $a3ccd82fa8860009$export$2e2bcd8739ae039 = $a3ccd82fa8860009$var$OptionRenderer;


// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $bb612fb8f67b03e0$var$MultiServerAutocompleteArrayInput = ({ optionText: optionText, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $3asgq$semappssemanticdataprovider.useDataServers)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const matchSuggestion = (0, $3asgq$react.useCallback)((filterValue: any, choice: any)=>choice[optionText].toLowerCase().match(filterValue.toLowerCase()), [
        optionText
    ]);
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.AutocompleteArrayInput), {
            matchSuggestion: matchSuggestion,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            optionText: /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $a3ccd82fa8860009$export$2e2bcd8739ae039), {
                optionText: optionText,
                dataServers: dataServers
            }),
            inputText: (choice: any) => choice[optionText],
            ...rest
        })
    );
};
var $bb612fb8f67b03e0$export$2e2bcd8739ae039 = $bb612fb8f67b03e0$var$MultiServerAutocompleteArrayInput;






// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $6c505c4dc3e51ff8$var$MultiServerAutocompleteInput = ({ optionText: optionText, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $3asgq$semappssemanticdataprovider.useDataServers)();
    // We cannot use OptionRenderer like MultiServerAutocompleteArrayInput because there is a bug with AutocompleteInput
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const optionTextWithServerName = (0, $3asgq$react.useCallback)((record: any) => {
        if (record && dataServers) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            const server = Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            return record[optionText] + (server ? ` (${server.name})` : '');
        }
    }, [
        optionText,
        dataServers
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.AutocompleteInput), {
        optionText: optionTextWithServerName,
        ...rest
    });
};
var $6c505c4dc3e51ff8$export$2e2bcd8739ae039 = $6c505c4dc3e51ff8$var$MultiServerAutocompleteInput;





// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $9aa37fe333ef760c$var$MultiLinesInput = (props: any) => /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.TextInput), {
        multiline: true,
        minRows: 2,
        format: (value: any) => value ? Array.isArray(value) ? value.join('\n') : value : '',
        parse: (value: any) => value.split(/\r?\n/),
        ...props
    });
var $9aa37fe333ef760c$export$2e2bcd8739ae039 = $9aa37fe333ef760c$var$MultiLinesInput;






const $83ac3fff69969204$var$ReferenceArrayInput = (props: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange } } = (0, $3asgq$reacthookform.useController)({
        name: props.source
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ReferenceArrayInput), {
        ...props
    });
};
var $83ac3fff69969204$export$2e2bcd8739ae039 = $83ac3fff69969204$var$ReferenceArrayInput;





const $6fb40d62998d2ee1$var$format = (value: any) => {
    // If there is no value, return immediately
    if (!value) return value;
    // If the value is an object with an @id field, return the uri
    return typeof value === 'object' ? value.id || value['@id'] : value;
};
// @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
const $6fb40d62998d2ee1$var$ReferenceInput = ({ children: children, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const child = (0, ($parcel$interopDefault($3asgq$react))).Children.only(children);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $3asgq$reactjsxruntime.jsx)((0, $3asgq$reactadmin.ReferenceInput), {
        ...rest,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, ($parcel$interopDefault($3asgq$react))).cloneElement(child, {
            format: $6fb40d62998d2ee1$var$format
        })
    });
};
var $6fb40d62998d2ee1$export$2e2bcd8739ae039 = $6fb40d62998d2ee1$var$ReferenceInput;




//# sourceMappingURL=index.cjs.js.map
