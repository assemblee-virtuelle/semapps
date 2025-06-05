import {jsx as $fAvTC$jsx, jsxs as $fAvTC$jsxs} from "react/jsx-runtime";
import {ImageInput as $fAvTC$ImageInput, AutocompleteArrayInput as $fAvTC$AutocompleteArrayInput, useRecordContext as $fAvTC$useRecordContext, AutocompleteInput as $fAvTC$AutocompleteInput, TextInput as $fAvTC$TextInput, ReferenceArrayInput as $fAvTC$ReferenceArrayInput, ReferenceInput as $fAvTC$ReferenceInput} from "react-admin";
import $fAvTC$react, {useCallback as $fAvTC$useCallback, useEffect as $fAvTC$useEffect} from "react";
import {useDataServers as $fAvTC$useDataServers} from "@semapps/semantic-data-provider";
import {useController as $fAvTC$useController} from "react-hook-form";

/* eslint-disable react/react-in-jsx-scope */ 

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const $be5569a64aeca92c$var$transformFile = (file)=>{
    const preview = URL.createObjectURL(file);
    return {
        rawFile: file,
        src: preview,
        title: file.name
    };
};
const $be5569a64aeca92c$var$format = (v)=>{
    if (typeof v === 'string') return {
        src: v
    };
    if (Array.isArray(v)) return v.map((e)=>typeof e === 'string' ? {
            src: e
        } : e);
    return v;
};
const $be5569a64aeca92c$var$parse = (v)=>{
    if (Array.isArray(v)) return v.map((e)=>$be5569a64aeca92c$var$parse(e));
    if (v instanceof File) return $be5569a64aeca92c$var$transformFile(v);
    if (v?.src && !('rawFile' in v)) return v.src;
    return v;
};
const $be5569a64aeca92c$var$ImageInput = ({ source: source, ...otherProps })=>{
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ImageInput), {
        source: source,
        format: $be5569a64aeca92c$var$format,
        parse: $be5569a64aeca92c$var$parse,
        ...otherProps
    });
};
var $be5569a64aeca92c$export$2e2bcd8739ae039 = $be5569a64aeca92c$var$ImageInput;









const $b23d9d5b6162e692$var$OptionRenderer = ({ optionText: optionText, dataServers: dataServers })=>{
    const record = (0, $fAvTC$useRecordContext)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const server = dataServers && Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
    return /*#__PURE__*/ (0, $fAvTC$jsxs)("span", {
        children: [
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            record[optionText],
            server && /*#__PURE__*/ (0, $fAvTC$jsxs)("em", {
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
var $b23d9d5b6162e692$export$2e2bcd8739ae039 = $b23d9d5b6162e692$var$OptionRenderer;


const $f6a1f9f295a87037$var$MultiServerAutocompleteArrayInput = ({ optionText: optionText, ...rest })=>{
    const dataServers = (0, $fAvTC$useDataServers)();
    const matchSuggestion = (0, $fAvTC$useCallback)((filterValue, choice)=>choice[optionText].toLowerCase().match(filterValue.toLowerCase()), [
        optionText
    ]);
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$AutocompleteArrayInput), {
        matchSuggestion: matchSuggestion,
        optionText: /*#__PURE__*/ (0, $fAvTC$jsx)((0, $b23d9d5b6162e692$export$2e2bcd8739ae039), {
            optionText: optionText,
            dataServers: dataServers
        }),
        inputText: (choice)=>choice[optionText],
        ...rest
    });
};
var $f6a1f9f295a87037$export$2e2bcd8739ae039 = $f6a1f9f295a87037$var$MultiServerAutocompleteArrayInput;






const $109c96749658c295$var$MultiServerAutocompleteInput = ({ optionText: optionText, ...rest })=>{
    const dataServers = (0, $fAvTC$useDataServers)();
    // We cannot use OptionRenderer like MultiServerAutocompleteArrayInput because there is a bug with AutocompleteInput
    const optionTextWithServerName = (0, $fAvTC$useCallback)((record)=>{
        if (record && dataServers) {
            const server = Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
            return record[optionText] + (server ? ` (${server.name})` : '');
        }
    }, [
        optionText,
        dataServers
    ]);
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$AutocompleteInput), {
        optionText: optionTextWithServerName,
        ...rest
    });
};
var $109c96749658c295$export$2e2bcd8739ae039 = $109c96749658c295$var$MultiServerAutocompleteInput;





const $56023c392f290bc6$var$MultiLinesInput = (props)=>/*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$TextInput), {
        multiline: true,
        minRows: 2,
        format: (value)=>value ? Array.isArray(value) ? value.join('\n') : value : '',
        parse: (value)=>value.split(/\r?\n/),
        ...props
    });
var $56023c392f290bc6$export$2e2bcd8739ae039 = $56023c392f290bc6$var$MultiLinesInput;






const $40d113c1dd835e32$var$ReferenceArrayInput = (props)=>{
    const { field: { value: value, onChange: onChange } } = (0, $fAvTC$useController)({
        name: props.source
    });
    (0, $fAvTC$useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ReferenceArrayInput), {
        ...props
    });
};
var $40d113c1dd835e32$export$2e2bcd8739ae039 = $40d113c1dd835e32$var$ReferenceArrayInput;





const $f7451f4d7b42f8bb$var$format = (value)=>{
    // If there is no value, return immediately
    if (!value) return value;
    // If the value is an object with an @id field, return the uri
    return typeof value === 'object' ? value.id || value['@id'] : value;
};
const $f7451f4d7b42f8bb$var$ReferenceInput = ({ children: children, ...rest })=>{
    const child = (0, $fAvTC$react).Children.only(children);
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ReferenceInput), {
        ...rest,
        children: /*#__PURE__*/ (0, $fAvTC$react).cloneElement(child, {
            format: $f7451f4d7b42f8bb$var$format
        })
    });
};
var $f7451f4d7b42f8bb$export$2e2bcd8739ae039 = $f7451f4d7b42f8bb$var$ReferenceInput;




export {$be5569a64aeca92c$export$2e2bcd8739ae039 as ImageInput, $f6a1f9f295a87037$export$2e2bcd8739ae039 as MultiServerAutocompleteArrayInput, $109c96749658c295$export$2e2bcd8739ae039 as MultiServerAutocompleteInput, $56023c392f290bc6$export$2e2bcd8739ae039 as MultiLinesInput, $40d113c1dd835e32$export$2e2bcd8739ae039 as ReferenceArrayInput, $f7451f4d7b42f8bb$export$2e2bcd8739ae039 as ReferenceInput};
//# sourceMappingURL=index.es.js.map
