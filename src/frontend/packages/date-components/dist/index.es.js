import {jsx as $1h8NM$jsx} from "react/jsx-runtime";
import {useCallback as $1h8NM$useCallback, useMemo as $1h8NM$useMemo} from "react";
import {DatePicker as $1h8NM$DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker as $1h8NM$TimePicker} from "@mui/x-date-pickers/TimePicker";
import {DateTimePicker as $1h8NM$DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {useInput as $1h8NM$useInput, FieldTitle as $1h8NM$FieldTitle, InputHelperText as $1h8NM$InputHelperText, useListContext as $1h8NM$useListContext, useCreatePath as $1h8NM$useCreatePath} from "react-admin";
import {LocalizationProvider as $1h8NM$LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns as $1h8NM$AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import $1h8NM$fullcalendarreact from "@fullcalendar/react";
import $1h8NM$fullcalendardaygrid from "@fullcalendar/daygrid";
import {useTheme as $1h8NM$useTheme} from "@mui/material";
import $1h8NM$muistylesmakeStyles from "@mui/styles/makeStyles";
import {useSearchParams as $1h8NM$useSearchParams, useNavigate as $1h8NM$useNavigate} from "react-router-dom";
import $1h8NM$fullcalendarlist from "@fullcalendar/list";











const $85cccff3a4734cfe$var$leftPad = (nb = 2)=>(value)=>("0".repeat(nb) + value).slice(-nb);
const $85cccff3a4734cfe$var$leftPad4 = $85cccff3a4734cfe$var$leftPad(4);
const $85cccff3a4734cfe$var$leftPad2 = $85cccff3a4734cfe$var$leftPad(2);
// yyyy-MM-ddThh:mm
const $85cccff3a4734cfe$var$dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
/**
 * @param {Date} value value to convert
 * @returns {string} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */ const $85cccff3a4734cfe$var$convertDateToString = (value)=>{
    if (!(value instanceof Date) || isNaN(value.getDate())) return "";
    const yy = $85cccff3a4734cfe$var$leftPad4(value.getFullYear());
    const MM = $85cccff3a4734cfe$var$leftPad2(value.getMonth() + 1);
    const dd = $85cccff3a4734cfe$var$leftPad2(value.getDate());
    const hh = $85cccff3a4734cfe$var$leftPad2(value.getHours());
    const mm = $85cccff3a4734cfe$var$leftPad2(value.getMinutes());
    return `${yy}-${MM}-${dd}T${hh}:${mm}`;
};
const $85cccff3a4734cfe$export$59113f23fb667b84 = (value)=>{
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === "") return "";
    if (value instanceof Date) return $85cccff3a4734cfe$var$convertDateToString(value);
    // valid dates should not be converted
    if ($85cccff3a4734cfe$var$dateTimeRegex.test(value)) return value;
    return $85cccff3a4734cfe$var$convertDateToString(new Date(value));
};
const $85cccff3a4734cfe$export$9a692607b62bf94e = (value)=>value ? new Date(value) : "";


const $23b8ae46df88f164$var$Picker = ({ PickerComponent: PickerComponent, format: format = (0, $85cccff3a4734cfe$export$59113f23fb667b84), label: label, source: source, helperText: helperText, onBlur: onBlur, onChange: onChange, onFocus: onFocus, parse: parse = (0, $85cccff3a4734cfe$export$9a692607b62bf94e), validate: validate, defaultValue: defaultValue, locale: locale, pickerVariant: pickerVariant = "dialog", stringFormat: stringFormat = "ISO", allowClear: allowClear, ...rest })=>{
    const { field: field, isRequired: isRequired, fieldState: { error: error, isTouched: isTouched } } = (0, $1h8NM$useInput)({
        format: format,
        onBlur: onBlur,
        onChange: onChange,
        onFocus: onFocus,
        parse: parse,
        source: source,
        validate: validate,
        ...rest
    });
    const handleChange = (0, $1h8NM$useCallback)((value)=>{
        Date.parse(value) ? field.onChange(stringFormat === "ISO" ? value.toISOString() : value.toString()) : field.onChange(null);
    }, []);
    return /*#__PURE__*/ (0, $1h8NM$jsx)((0, $1h8NM$LocalizationProvider), {
        dateAdapter: (0, $1h8NM$AdapterDateFns),
        adapterLocale: locale,
        children: /*#__PURE__*/ (0, $1h8NM$jsx)(PickerComponent, {
            label: /*#__PURE__*/ (0, $1h8NM$jsx)((0, $1h8NM$FieldTitle), {
                label: label,
                source: source,
                isRequired: isRequired
            }),
            error: !!(isTouched && error),
            slotProps: {
                textField: {
                    helperText: /*#__PURE__*/ (0, $1h8NM$jsx)((0, $1h8NM$InputHelperText), {
                        touched: isTouched,
                        error: error,
                        helperText: helperText
                    })
                }
            },
            ...$23b8ae46df88f164$var$sanitizeRestProps(rest),
            value: field.value ? new Date(field.value) : null,
            onChange: handleChange,
            onBlur: ()=>field.onBlur(field.value ? stringFormat === "ISO" ? new Date(field.value).toISOString() : new Date(field.value).toString() : null)
        })
    });
};
$23b8ae46df88f164$var$Picker.defaultProps = {
    isRequired: false,
    meta: {
        isTouched: false,
        error: false
    },
    locale: undefined,
    parse: (value)=>value === "" ? null : value // Avoid saving an empty string in the dataset
};
const $23b8ae46df88f164$var$sanitizeRestProps = ({ allowEmpty: allowEmpty, alwaysOn: alwaysOn, component: component, defaultValue: defaultValue, format: format, formClassName: formClassName, initialValue: initialValue, initializeForm: initializeForm, input: input, isRequired: isRequired, label: label, limitChoicesToValue: limitChoicesToValue, locale: locale, meta: meta, options: options, optionText: optionText, optionValue: optionValue, parse: parse, source: source, textAlign: textAlign, translate: translate, translateChoice: translateChoice, labelTime: labelTime, ...rest })=>rest;
var $23b8ae46df88f164$export$2e2bcd8739ae039 = $23b8ae46df88f164$var$Picker;











const $37245c02f9b1b006$var$useFullCalendarProps = ({ label: label, startDate: startDate, endDate: endDate, linkType: linkType })=>{
    const { data: data, isLoading: isLoading, resource: resource } = (0, $1h8NM$useListContext)();
    const [searchParams, setSearchParams] = (0, $1h8NM$useSearchParams)();
    const navigate = (0, $1h8NM$useNavigate)();
    const createPath = (0, $1h8NM$useCreatePath)();
    const query = new URLSearchParams(location.search);
    // Bypass the link in order to use React-Router
    const eventClick = (0, $1h8NM$useCallback)(({ event: event, jsEvent: jsEvent })=>{
        jsEvent.preventDefault();
        navigate(event.url);
    }, []);
    // Change the query string when month change
    const datesSet = (0, $1h8NM$useCallback)(({ view: view })=>{
        setSearchParams((params)=>({
                ...params,
                month: view.currentStart.getMonth() + 1,
                year: view.currentStart.getFullYear()
            }));
    }, [
        setSearchParams
    ]);
    const events = (0, $1h8NM$useMemo)(()=>!isLoading && data.filter((record)=>record).map((record)=>({
                id: record.id,
                title: typeof label === "string" ? record[label] : label(record),
                start: typeof startDate === "string" ? record[startDate] : startDate(record),
                end: typeof endDate === "string" ? record[endDate] : endDate(record),
                url: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                })
            })), [
        isLoading,
        data,
        resource,
        createPath
    ]);
    return {
        initialDate: query.has("month") ? new Date(query.get("year"), query.get("month") - 1) : new Date(),
        events: events,
        datesSet: datesSet,
        eventClick: eventClick
    };
};
var $37245c02f9b1b006$export$2e2bcd8739ae039 = $37245c02f9b1b006$var$useFullCalendarProps;


const $abbcc02f55461290$var$useGlobalStyles = (0, $1h8NM$muistylesmakeStyles)((theme)=>({
        "@global": {
            ".fc-button": {
                backgroundColor: `${theme.palette.primary.main} !important`,
                border: "none !important",
                opacity: "1 !important"
            },
            ".fc-day-today": {
                backgroundColor: `${theme.palette.secondary.light} !important`
            },
            // Overwrite violet color of links
            "a.fc-daygrid-dot-event": {
                color: "black !important"
            }
        }
    }));
const $abbcc02f55461290$var$CalendarList = (props)=>{
    const theme = (0, $1h8NM$useTheme)();
    const fullCalendarProps = (0, $37245c02f9b1b006$export$2e2bcd8739ae039)(props);
    $abbcc02f55461290$var$useGlobalStyles();
    return /*#__PURE__*/ (0, $1h8NM$jsx)((0, $1h8NM$fullcalendarreact), {
        plugins: [
            (0, $1h8NM$fullcalendardaygrid)
        ],
        locale: props.locale,
        initialView: "dayGridMonth",
        eventBackgroundColor: theme.palette.primary.main,
        ...fullCalendarProps
    });
};
$abbcc02f55461290$var$CalendarList.defaultProps = {
    linkType: "edit"
};
var $abbcc02f55461290$export$2e2bcd8739ae039 = $abbcc02f55461290$var$CalendarList;








const $69d9f850452774a2$var$useGlobalStyles = (0, $1h8NM$muistylesmakeStyles)((theme)=>({
        "@global": {
            ".fc-button": {
                backgroundColor: `${theme.palette.primary.main} !important`,
                border: "none !important",
                opacity: "1 !important"
            }
        }
    }));
const $69d9f850452774a2$var$DaysList = (props)=>{
    const fullCalendarProps = (0, $37245c02f9b1b006$export$2e2bcd8739ae039)(props);
    $69d9f850452774a2$var$useGlobalStyles();
    return /*#__PURE__*/ (0, $1h8NM$jsx)((0, $1h8NM$fullcalendarreact), {
        plugins: [
            (0, $1h8NM$fullcalendarlist)
        ],
        locale: props.locale,
        initialView: "listMonth",
        ...fullCalendarProps
    });
};
$69d9f850452774a2$var$DaysList.defaultProps = {
    linkType: "edit"
};
var $69d9f850452774a2$export$2e2bcd8739ae039 = $69d9f850452774a2$var$DaysList;



const $92007338c717b459$export$7edc06cf1783b30f = (props)=>/*#__PURE__*/ (0, $1h8NM$jsx)((0, $23b8ae46df88f164$export$2e2bcd8739ae039), {
        PickerComponent: (0, $1h8NM$DatePicker),
        ...props
    });
const $92007338c717b459$export$a1af6f79df847fac = (props)=>/*#__PURE__*/ (0, $1h8NM$jsx)((0, $23b8ae46df88f164$export$2e2bcd8739ae039), {
        PickerComponent: (0, $1h8NM$TimePicker),
        ...props
    });
const $92007338c717b459$export$183478aa40b5df1 = (props)=>/*#__PURE__*/ (0, $1h8NM$jsx)((0, $23b8ae46df88f164$export$2e2bcd8739ae039), {
        PickerComponent: (0, $1h8NM$DateTimePicker),
        ...props
    });


export {$92007338c717b459$export$7edc06cf1783b30f as DateInput, $92007338c717b459$export$a1af6f79df847fac as TimeInput, $92007338c717b459$export$183478aa40b5df1 as DateTimeInput, $abbcc02f55461290$export$2e2bcd8739ae039 as CalendarList, $69d9f850452774a2$export$2e2bcd8739ae039 as DaysList, $37245c02f9b1b006$export$2e2bcd8739ae039 as useFullCalendarProps};
//# sourceMappingURL=index.es.js.map
