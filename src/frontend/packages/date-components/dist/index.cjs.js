var $g9yvC$reactjsxruntime = require("react/jsx-runtime");
var $g9yvC$react = require("react");
var $g9yvC$muixdatepickersDatePicker = require("@mui/x-date-pickers/DatePicker");
var $g9yvC$muixdatepickersTimePicker = require("@mui/x-date-pickers/TimePicker");
var $g9yvC$muixdatepickersDateTimePicker = require("@mui/x-date-pickers/DateTimePicker");
var $g9yvC$reactadmin = require("react-admin");
var $g9yvC$muixdatepickersLocalizationProvider = require("@mui/x-date-pickers/LocalizationProvider");
var $g9yvC$muixdatepickersAdapterDateFns = require("@mui/x-date-pickers/AdapterDateFns");
var $g9yvC$fullcalendarreact = require("@fullcalendar/react");
var $g9yvC$fullcalendardaygrid = require("@fullcalendar/daygrid");
var $g9yvC$muimaterial = require("@mui/material");
var $g9yvC$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $g9yvC$reactrouterdom = require("react-router-dom");
var $g9yvC$fullcalendarlist = require("@fullcalendar/list");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "DateInput", () => $2d95977354f78fa4$export$7edc06cf1783b30f);
$parcel$export(module.exports, "TimeInput", () => $2d95977354f78fa4$export$a1af6f79df847fac);
$parcel$export(module.exports, "DateTimeInput", () => $2d95977354f78fa4$export$183478aa40b5df1);
$parcel$export(module.exports, "CalendarList", () => $563c84827e91e322$export$2e2bcd8739ae039);
$parcel$export(module.exports, "DaysList", () => $5379d12b87e743a4$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useFullCalendarProps", () => $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039);










const $0dc8df9925f5313b$var$leftPad = (nb = 2)=>(value)=>("0".repeat(nb) + value).slice(-nb);
const $0dc8df9925f5313b$var$leftPad4 = $0dc8df9925f5313b$var$leftPad(4);
const $0dc8df9925f5313b$var$leftPad2 = $0dc8df9925f5313b$var$leftPad(2);
// yyyy-MM-ddThh:mm
const $0dc8df9925f5313b$var$dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
/**
 * @param {Date} value value to convert
 * @returns {string} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */ const $0dc8df9925f5313b$var$convertDateToString = (value)=>{
    if (!(value instanceof Date) || isNaN(value.getDate())) return "";
    const yy = $0dc8df9925f5313b$var$leftPad4(value.getFullYear());
    const MM = $0dc8df9925f5313b$var$leftPad2(value.getMonth() + 1);
    const dd = $0dc8df9925f5313b$var$leftPad2(value.getDate());
    const hh = $0dc8df9925f5313b$var$leftPad2(value.getHours());
    const mm = $0dc8df9925f5313b$var$leftPad2(value.getMinutes());
    return `${yy}-${MM}-${dd}T${hh}:${mm}`;
};
const $0dc8df9925f5313b$export$59113f23fb667b84 = (value)=>{
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === "") return "";
    if (value instanceof Date) return $0dc8df9925f5313b$var$convertDateToString(value);
    // valid dates should not be converted
    if ($0dc8df9925f5313b$var$dateTimeRegex.test(value)) return value;
    return $0dc8df9925f5313b$var$convertDateToString(new Date(value));
};
const $0dc8df9925f5313b$export$9a692607b62bf94e = (value)=>value ? new Date(value) : "";


const $68a2d690bd37b19a$var$Picker = ({ PickerComponent: PickerComponent, format: format = (0, $0dc8df9925f5313b$export$59113f23fb667b84), label: label, source: source, helperText: helperText, onBlur: onBlur, onChange: onChange, onFocus: onFocus, parse: parse = (0, $0dc8df9925f5313b$export$9a692607b62bf94e), validate: validate, defaultValue: defaultValue, locale: locale, pickerVariant: pickerVariant = "dialog", stringFormat: stringFormat = "ISO", allowClear: allowClear, ...rest })=>{
    const { field: field, isRequired: isRequired, fieldState: { error: error, isTouched: isTouched } } = (0, $g9yvC$reactadmin.useInput)({
        format: format,
        onBlur: onBlur,
        onChange: onChange,
        onFocus: onFocus,
        parse: parse,
        source: source,
        validate: validate,
        ...rest
    });
    const handleChange = (0, $g9yvC$react.useCallback)((value)=>{
        Date.parse(value) ? field.onChange(stringFormat === "ISO" ? value.toISOString() : value.toString()) : field.onChange(null);
    }, []);
    return /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $g9yvC$muixdatepickersLocalizationProvider.LocalizationProvider), {
        dateAdapter: (0, $g9yvC$muixdatepickersAdapterDateFns.AdapterDateFns),
        adapterLocale: locale,
        children: /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)(PickerComponent, {
            label: /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $g9yvC$reactadmin.FieldTitle), {
                label: label,
                source: source,
                isRequired: isRequired
            }),
            error: !!(isTouched && error),
            slotProps: {
                textField: {
                    helperText: /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $g9yvC$reactadmin.InputHelperText), {
                        touched: isTouched,
                        error: error,
                        helperText: helperText
                    })
                }
            },
            ...$68a2d690bd37b19a$var$sanitizeRestProps(rest),
            value: field.value ? new Date(field.value) : null,
            onChange: handleChange,
            onBlur: ()=>field.onBlur(field.value ? stringFormat === "ISO" ? new Date(field.value).toISOString() : new Date(field.value).toString() : null)
        })
    });
};
$68a2d690bd37b19a$var$Picker.defaultProps = {
    isRequired: false,
    meta: {
        isTouched: false,
        error: false
    },
    locale: undefined,
    parse: (value)=>value === "" ? null : value // Avoid saving an empty string in the dataset
};
const $68a2d690bd37b19a$var$sanitizeRestProps = ({ allowEmpty: allowEmpty, alwaysOn: alwaysOn, component: component, defaultValue: defaultValue, format: format, formClassName: formClassName, initialValue: initialValue, initializeForm: initializeForm, input: input, isRequired: isRequired, label: label, limitChoicesToValue: limitChoicesToValue, locale: locale, meta: meta, options: options, optionText: optionText, optionValue: optionValue, parse: parse, source: source, textAlign: textAlign, translate: translate, translateChoice: translateChoice, labelTime: labelTime, ...rest })=>rest;
var $68a2d690bd37b19a$export$2e2bcd8739ae039 = $68a2d690bd37b19a$var$Picker;











const $c8dbd8ec3b8f34cc$var$useFullCalendarProps = ({ label: label, startDate: startDate, endDate: endDate, linkType: linkType })=>{
    const { data: data, isLoading: isLoading, resource: resource } = (0, $g9yvC$reactadmin.useListContext)();
    const [searchParams, setSearchParams] = (0, $g9yvC$reactrouterdom.useSearchParams)();
    const navigate = (0, $g9yvC$reactrouterdom.useNavigate)();
    const createPath = (0, $g9yvC$reactadmin.useCreatePath)();
    const query = new URLSearchParams(location.search);
    // Bypass the link in order to use React-Router
    const eventClick = (0, $g9yvC$react.useCallback)(({ event: event, jsEvent: jsEvent })=>{
        jsEvent.preventDefault();
        navigate(event.url);
    }, []);
    // Change the query string when month change
    const datesSet = (0, $g9yvC$react.useCallback)(({ view: view })=>{
        setSearchParams((params)=>({
                ...params,
                month: view.currentStart.getMonth() + 1,
                year: view.currentStart.getFullYear()
            }));
    }, [
        setSearchParams
    ]);
    const events = (0, $g9yvC$react.useMemo)(()=>!isLoading && data.filter((record)=>record).map((record)=>({
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
var $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039 = $c8dbd8ec3b8f34cc$var$useFullCalendarProps;


const $563c84827e91e322$var$useGlobalStyles = (0, ($parcel$interopDefault($g9yvC$muistylesmakeStyles)))((theme)=>({
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
const $563c84827e91e322$var$CalendarList = (props)=>{
    const theme = (0, $g9yvC$muimaterial.useTheme)();
    const fullCalendarProps = (0, $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039)(props);
    $563c84827e91e322$var$useGlobalStyles();
    return /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, ($parcel$interopDefault($g9yvC$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($g9yvC$fullcalendardaygrid)))
        ],
        locale: props.locale,
        initialView: "dayGridMonth",
        eventBackgroundColor: theme.palette.primary.main,
        ...fullCalendarProps
    });
};
$563c84827e91e322$var$CalendarList.defaultProps = {
    linkType: "edit"
};
var $563c84827e91e322$export$2e2bcd8739ae039 = $563c84827e91e322$var$CalendarList;








const $5379d12b87e743a4$var$useGlobalStyles = (0, ($parcel$interopDefault($g9yvC$muistylesmakeStyles)))((theme)=>({
        "@global": {
            ".fc-button": {
                backgroundColor: `${theme.palette.primary.main} !important`,
                border: "none !important",
                opacity: "1 !important"
            }
        }
    }));
const $5379d12b87e743a4$var$DaysList = (props)=>{
    const fullCalendarProps = (0, $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039)(props);
    $5379d12b87e743a4$var$useGlobalStyles();
    return /*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, ($parcel$interopDefault($g9yvC$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($g9yvC$fullcalendarlist)))
        ],
        locale: props.locale,
        initialView: "listMonth",
        ...fullCalendarProps
    });
};
$5379d12b87e743a4$var$DaysList.defaultProps = {
    linkType: "edit"
};
var $5379d12b87e743a4$export$2e2bcd8739ae039 = $5379d12b87e743a4$var$DaysList;



const $2d95977354f78fa4$export$7edc06cf1783b30f = (props)=>/*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $68a2d690bd37b19a$export$2e2bcd8739ae039), {
        PickerComponent: (0, $g9yvC$muixdatepickersDatePicker.DatePicker),
        ...props
    });
const $2d95977354f78fa4$export$a1af6f79df847fac = (props)=>/*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $68a2d690bd37b19a$export$2e2bcd8739ae039), {
        PickerComponent: (0, $g9yvC$muixdatepickersTimePicker.TimePicker),
        ...props
    });
const $2d95977354f78fa4$export$183478aa40b5df1 = (props)=>/*#__PURE__*/ (0, $g9yvC$reactjsxruntime.jsx)((0, $68a2d690bd37b19a$export$2e2bcd8739ae039), {
        PickerComponent: (0, $g9yvC$muixdatepickersDateTimePicker.DateTimePicker),
        ...props
    });


//# sourceMappingURL=index.cjs.js.map
