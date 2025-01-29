var $3RhHq$reactjsxruntime = require("react/jsx-runtime");
require("@fullcalendar/react/dist/vdom");
var $3RhHq$muixdatepickersDatePicker = require("@mui/x-date-pickers/DatePicker");
var $3RhHq$muixdatepickersTimePicker = require("@mui/x-date-pickers/TimePicker");
var $3RhHq$muixdatepickersDateTimePicker = require("@mui/x-date-pickers/DateTimePicker");
var $3RhHq$react = require("react");
var $3RhHq$reactadmin = require("react-admin");
var $3RhHq$muixdatepickersLocalizationProvider = require("@mui/x-date-pickers/LocalizationProvider");
var $3RhHq$muixdatepickersAdapterDateFns = require("@mui/x-date-pickers/AdapterDateFns");
var $3RhHq$fullcalendarreact = require("@fullcalendar/react");
var $3RhHq$fullcalendardaygrid = require("@fullcalendar/daygrid");
var $3RhHq$muimaterial = require("@mui/material");
var $3RhHq$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $3RhHq$reactrouterdom = require("react-router-dom");
var $3RhHq$fullcalendarlist = require("@fullcalendar/list");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "DateInput", () => $0ec82123656742c1$export$7edc06cf1783b30f);
$parcel$export(module.exports, "TimeInput", () => $0ec82123656742c1$export$a1af6f79df847fac);
$parcel$export(module.exports, "DateTimeInput", () => $0ec82123656742c1$export$183478aa40b5df1);
$parcel$export(module.exports, "CalendarList", () => $563c84827e91e322$export$2e2bcd8739ae039);
$parcel$export(module.exports, "DaysList", () => $5379d12b87e743a4$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useFullCalendarProps", () => $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039);
/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/jsx-props-no-spreading */ // Solves bug with Vite in dev mode. Can be removed when we upgrade to FullCalendar v6
// See https://github.com/fullcalendar/fullcalendar-vue/issues/152





/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */ 




const $c332daa71b957685$var$Picker = ({ PickerComponent: PickerComponent, label: label, source: source, helperText: helperText, fullWidth: fullWidth, onBlur: onBlur, onChange: onChange, format: format, parse: parse, validate: validate, defaultValue: defaultValue, locale: locale, translations: translations, stringFormat: stringFormat = "ISO", ...rest })=>{
    const { field: field, isRequired: isRequired, fieldState: { error: error, isTouched: isTouched, invalid: invalid }, formState: { isSubmitted: isSubmitted } } = (0, $3RhHq$reactadmin.useInput)({
        format: format,
        onBlur: onBlur,
        onChange: onChange,
        parse: parse,
        source: source,
        validate: validate,
        defaultValue: defaultValue
    });
    const handleChange = (0, $3RhHq$react.useCallback)((value)=>{
        if (value instanceof Date) field.onChange(stringFormat === "ISO" ? value.toISOString() : value.toString());
        else field.onChange(null);
    }, [
        field,
        stringFormat
    ]);
    const translateLabel = (0, $3RhHq$reactadmin.useTranslateLabel)();
    const translatedLabel = /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsxs)("span", {
        children: [
            translateLabel({
                label: label,
                source: source
            }),
            isRequired && /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)("span", {
                "aria-hidden": "true",
                children: "\u2009*"
            })
        ]
    });
    return /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $3RhHq$muixdatepickersLocalizationProvider.LocalizationProvider), {
        dateAdapter: (0, $3RhHq$muixdatepickersAdapterDateFns.AdapterDateFns),
        adapterLocale: locale,
        localeText: translations?.components.MuiLocalizationProvider.defaultProps.localeText,
        children: /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)(PickerComponent, {
            label: translatedLabel,
            slotProps: {
                textField: {
                    error: (isTouched || isSubmitted) && invalid,
                    size: "small",
                    fullWidth: fullWidth,
                    helperText: /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $3RhHq$reactadmin.InputHelperText), {
                        touched: isTouched || isSubmitted,
                        error: error?.message,
                        helperText: helperText
                    })
                }
            },
            value: field.value ? new Date(field.value) : null,
            onChange: handleChange,
            ...rest
        })
    });
};
var $c332daa71b957685$export$2e2bcd8739ae039 = $c332daa71b957685$var$Picker;











const $c8dbd8ec3b8f34cc$var$useFullCalendarProps = ({ label: label, startDate: startDate, endDate: endDate, linkType: linkType = "edit" })=>{
    const { data: data, isLoading: isLoading, resource: resource } = (0, $3RhHq$reactadmin.useListContext)();
    const [searchParams, setSearchParams] = (0, $3RhHq$reactrouterdom.useSearchParams)();
    const navigate = (0, $3RhHq$reactrouterdom.useNavigate)();
    const createPath = (0, $3RhHq$reactadmin.useCreatePath)();
    const query = new URLSearchParams(location.search);
    // Bypass the link in order to use React-Router
    const eventClick = (0, $3RhHq$react.useCallback)(({ event: event, jsEvent: jsEvent })=>{
        jsEvent.preventDefault();
        navigate(event.url);
    }, []);
    // Change the query string when month change
    const datesSet = (0, $3RhHq$react.useCallback)(({ view: view })=>{
        setSearchParams((params)=>({
                ...params,
                month: view.currentStart.getMonth() + 1,
                year: view.currentStart.getFullYear()
            }));
    }, [
        setSearchParams
    ]);
    const events = (0, $3RhHq$react.useMemo)(()=>!isLoading && data.filter((record)=>record).map((record)=>({
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


const $563c84827e91e322$var$useGlobalStyles = (0, ($parcel$interopDefault($3RhHq$muistylesmakeStyles)))((theme)=>({
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
    const theme = (0, $3RhHq$muimaterial.useTheme)();
    const fullCalendarProps = (0, $c8dbd8ec3b8f34cc$export$2e2bcd8739ae039)(props);
    $563c84827e91e322$var$useGlobalStyles();
    return /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, ($parcel$interopDefault($3RhHq$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($3RhHq$fullcalendardaygrid)))
        ],
        locale: props.locale,
        initialView: "dayGridMonth",
        eventBackgroundColor: theme.palette.primary.main,
        ...fullCalendarProps
    });
};
var $563c84827e91e322$export$2e2bcd8739ae039 = $563c84827e91e322$var$CalendarList;








const $5379d12b87e743a4$var$useGlobalStyles = (0, ($parcel$interopDefault($3RhHq$muistylesmakeStyles)))((theme)=>({
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
    return /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, ($parcel$interopDefault($3RhHq$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($3RhHq$fullcalendarlist)))
        ],
        locale: props.locale,
        initialView: "listMonth",
        ...fullCalendarProps
    });
};
var $5379d12b87e743a4$export$2e2bcd8739ae039 = $5379d12b87e743a4$var$DaysList;



const $0ec82123656742c1$export$7edc06cf1783b30f = (props)=>/*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $c332daa71b957685$export$2e2bcd8739ae039), {
        PickerComponent: (0, $3RhHq$muixdatepickersDatePicker.DatePicker),
        ...props
    });
const $0ec82123656742c1$export$a1af6f79df847fac = (props)=>/*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $c332daa71b957685$export$2e2bcd8739ae039), {
        PickerComponent: (0, $3RhHq$muixdatepickersTimePicker.TimePicker),
        ...props
    });
const $0ec82123656742c1$export$183478aa40b5df1 = (props)=>/*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $c332daa71b957685$export$2e2bcd8739ae039), {
        PickerComponent: (0, $3RhHq$muixdatepickersDateTimePicker.DateTimePicker),
        ...props
    });


//# sourceMappingURL=index.cjs.js.map
