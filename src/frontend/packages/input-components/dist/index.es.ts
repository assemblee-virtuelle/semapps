import {jsx as $fAvTC$jsx, jsxs as $fAvTC$jsxs} from "react/jsx-runtime";
import {ImageInput as $fAvTC$ImageInput, AutocompleteArrayInput as $fAvTC$AutocompleteArrayInput, useRecordContext as $fAvTC$useRecordContext, AutocompleteInput as $fAvTC$AutocompleteInput, TextInput as $fAvTC$TextInput, ReferenceArrayInput as $fAvTC$ReferenceArrayInput, ReferenceInput as $fAvTC$ReferenceInput} from "react-admin";
import $fAvTC$react, {useCallback as $fAvTC$useCallback, useEffect as $fAvTC$useEffect} from "react";
import {useDataServers as $fAvTC$useDataServers} from "@semapps/semantic-data-provider";
import {useController as $fAvTC$useController} from "react-hook-form";

/* eslint-disable react/react-in-jsx-scope */ 

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const $be5569a64aeca92c$var$transformFile = (file: any) => {
    const preview = URL.createObjectURL(file);
    return {
        rawFile: file,
        src: preview,
        title: file.name
    };
};
const $be5569a64aeca92c$var$format = (v: any) => {
    if (typeof v === 'string') return {
        src: v
    };
    if (Array.isArray(v)) return v.map((e)=>typeof e === 'string' ? {
            src: e
        } : e);
    return v;
};
// @ts-expect-error TS(7023): '$be5569a64aeca92c$var$parse' implicitly has retur... Remove this comment to see the full error message
const $be5569a64aeca92c$var$parse = (v: any) => {
    if (Array.isArray(v)) return v.map((e)=>$be5569a64aeca92c$var$parse(e));
    if (v instanceof File) return $be5569a64aeca92c$var$transformFile(v);
    if (v?.src && !('rawFile' in v)) return v.src;
    return v;
};
// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $be5569a64aeca92c$var$ImageInput = ({ source: source, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ImageInput), {
        source: source,
        format: $be5569a64aeca92c$var$format,
        parse: $be5569a64aeca92c$var$parse,
        ...otherProps
    });
};
var $be5569a64aeca92c$export$2e2bcd8739ae039 = $be5569a64aeca92c$var$ImageInput;









// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $c87f07c114e8d06d$var$OptionRenderer = ({ optionText: optionText, dataServers: dataServers })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $fAvTC$useRecordContext)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const server = dataServers && Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fAvTC$jsxs)("span", {
        children: [
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            record[optionText],
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
var $c87f07c114e8d06d$export$2e2bcd8739ae039 = $c87f07c114e8d06d$var$OptionRenderer;


// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $6339f423cc6c3ee3$var$MultiServerAutocompleteArrayInput = ({ optionText: optionText, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $fAvTC$useDataServers)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const matchSuggestion = (0, $fAvTC$useCallback)((filterValue: any, choice: any)=>choice[optionText].toLowerCase().match(filterValue.toLowerCase()), [
        optionText
    ]);
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$AutocompleteArrayInput), {
            matchSuggestion: matchSuggestion,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            optionText: /*#__PURE__*/ (0, $fAvTC$jsx)((0, $c87f07c114e8d06d$export$2e2bcd8739ae039), {
                optionText: optionText,
                dataServers: dataServers
            }),
            inputText: (choice: any) => choice[optionText],
            ...rest
        })
    );
};
var $6339f423cc6c3ee3$export$2e2bcd8739ae039 = $6339f423cc6c3ee3$var$MultiServerAutocompleteArrayInput;






// @ts-expect-error TS(7031): Binding element 'optionText' implicitly has an 'an... Remove this comment to see the full error message
const $b0f28d60b9360e4c$var$MultiServerAutocompleteInput = ({ optionText: optionText, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $fAvTC$useDataServers)();
    // We cannot use OptionRenderer like MultiServerAutocompleteArrayInput because there is a bug with AutocompleteInput
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const optionTextWithServerName = (0, $fAvTC$useCallback)((record: any) => {
        if (record && dataServers) {
            const server = Object.values(dataServers).find((server)=>record.id.startsWith(server.baseUrl));
            return record[optionText] + (server ? ` (${server.name})` : '');
        }
    }, [
        optionText,
        dataServers
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$AutocompleteInput), {
        optionText: optionTextWithServerName,
        ...rest
    });
};
var $b0f28d60b9360e4c$export$2e2bcd8739ae039 = $b0f28d60b9360e4c$var$MultiServerAutocompleteInput;





// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $5caa484b443e2e14$var$MultiLinesInput = (props: any) => /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$TextInput), {
        multiline: true,
        minRows: 2,
        format: (value: any) => value ? Array.isArray(value) ? value.join('\n') : value : '',
        parse: (value: any) => value.split(/\r?\n/),
        ...props
    });
var $5caa484b443e2e14$export$2e2bcd8739ae039 = $5caa484b443e2e14$var$MultiLinesInput;






const $0a220aa421897b42$var$ReferenceArrayInput = (props: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange } } = (0, $fAvTC$useController)({
        name: props.source
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ReferenceArrayInput), {
        ...props
    });
};
var $0a220aa421897b42$export$2e2bcd8739ae039 = $0a220aa421897b42$var$ReferenceArrayInput;





const $4dc5aebf6fd9ab50$var$format = (value: any) => {
    // If there is no value, return immediately
    if (!value) return value;
    // If the value is an object with an @id field, return the uri
    return typeof value === 'object' ? value.id || value['@id'] : value;
};
// @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
const $4dc5aebf6fd9ab50$var$ReferenceInput = ({ children: children, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const child = (0, $fAvTC$react).Children.only(children);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fAvTC$jsx)((0, $fAvTC$ReferenceInput), {
        ...rest,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $fAvTC$react).cloneElement(child, {
            format: $4dc5aebf6fd9ab50$var$format
        })
    });
};
var $4dc5aebf6fd9ab50$export$2e2bcd8739ae039 = $4dc5aebf6fd9ab50$var$ReferenceInput;




export {$be5569a64aeca92c$export$2e2bcd8739ae039 as ImageInput, $6339f423cc6c3ee3$export$2e2bcd8739ae039 as MultiServerAutocompleteArrayInput, $b0f28d60b9360e4c$export$2e2bcd8739ae039 as MultiServerAutocompleteInput, $5caa484b443e2e14$export$2e2bcd8739ae039 as MultiLinesInput, $0a220aa421897b42$export$2e2bcd8739ae039 as ReferenceArrayInput, $4dc5aebf6fd9ab50$export$2e2bcd8739ae039 as ReferenceInput};
//# sourceMappingURL=index.es.js.map
