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
$parcel$export(module.exports, "CalendarList", () => $7d9b1d3645bfb046$export$2e2bcd8739ae039);
$parcel$export(module.exports, "DaysList", () => $f30a06264cfbf3f1$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useFullCalendarProps", () => $270c79206b8dbb68$export$2e2bcd8739ae039);
/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/jsx-props-no-spreading */ // Solves bug with Vite in dev mode. Can be removed when we upgrade to FullCalendar v6
// See https://github.com/fullcalendar/fullcalendar-vue/issues/152





/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */ 




const $c332daa71b957685$var$Picker = ({ PickerComponent: PickerComponent, label: label, source: source, helperText: helperText, fullWidth: fullWidth, onBlur: onBlur, onChange: onChange, format: format, parse: parse, validate: validate, defaultValue: defaultValue, locale: locale, translations: translations, stringFormat: stringFormat = 'ISO', ...rest })=>{
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
        if (value instanceof Date) field.onChange(stringFormat === 'ISO' ? value.toISOString() : value.toString());
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
                    size: 'small',
                    fullWidth: fullWidth,
                    helperText: // @ts-expect-error TS(2322): Type '{ touched: boolean; error: string | undefine... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, $3RhHq$reactadmin.InputHelperText), {
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










const $270c79206b8dbb68$var$useFullCalendarProps = ({ label: label, startDate: startDate, endDate: endDate, linkType: linkType = 'edit' })=>{
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
        // @ts-expect-error TS(2345): Argument of type '(params: URLSearchParams) => { m... Remove this comment to see the full error message
        setSearchParams((params)=>({
                ...params,
                month: view.currentStart.getMonth() + 1,
                year: view.currentStart.getFullYear()
            }));
    }, [
        setSearchParams
    ]);
    const events = (0, $3RhHq$react.useMemo)(()=>!isLoading && // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        data.filter((record)=>record).map((record)=>({
                id: record.id,
                title: typeof label === 'string' ? record[label] : label(record),
                start: typeof startDate === 'string' ? record[startDate] : startDate(record),
                end: typeof endDate === 'string' ? record[endDate] : endDate(record),
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
        // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
        events: events,
        datesSet: datesSet,
        eventClick: eventClick
    };
};
var $270c79206b8dbb68$export$2e2bcd8739ae039 = $270c79206b8dbb68$var$useFullCalendarProps;


const $7d9b1d3645bfb046$var$useGlobalStyles = (0, $3RhHq$muimaterial.makeStyles)((theme)=>({
        '@global': {
            '.fc-button': {
                backgroundColor: `${theme.palette.primary.main} !important`,
                border: 'none !important',
                opacity: '1 !important'
            },
            '.fc-day-today': {
                backgroundColor: `${theme.palette.secondary.light} !important`
            },
            // Overwrite violet color of links
            'a.fc-daygrid-dot-event': {
                color: 'black !important'
            }
        }
    }));
const $7d9b1d3645bfb046$var$CalendarList = (props)=>{
    const theme = (0, $3RhHq$muimaterial.useTheme)();
    const fullCalendarProps = (0, $270c79206b8dbb68$export$2e2bcd8739ae039)(props);
    // @ts-expect-error TS(2349): This expression is not callable.
    $7d9b1d3645bfb046$var$useGlobalStyles();
    return(// @ts-expect-error TS(2769): No overload matches this call.
    /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, ($parcel$interopDefault($3RhHq$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($3RhHq$fullcalendardaygrid)))
        ],
        locale: props.locale,
        initialView: "dayGridMonth",
        eventBackgroundColor: theme.palette.primary.main,
        ...fullCalendarProps
    }));
};
var $7d9b1d3645bfb046$export$2e2bcd8739ae039 = $7d9b1d3645bfb046$var$CalendarList;








const $f30a06264cfbf3f1$var$useGlobalStyles = (0, $3RhHq$muimaterial.makeStyles)((theme)=>({
        '@global': {
            '.fc-button': {
                backgroundColor: `${theme.palette.primary.main} !important`,
                border: 'none !important',
                opacity: '1 !important'
            }
        }
    }));
const $f30a06264cfbf3f1$var$DaysList = (props)=>{
    const fullCalendarProps = (0, $270c79206b8dbb68$export$2e2bcd8739ae039)(props);
    $f30a06264cfbf3f1$var$useGlobalStyles();
    // @ts-expect-error TS(2769): No overload matches this call.
    return /*#__PURE__*/ (0, $3RhHq$reactjsxruntime.jsx)((0, ($parcel$interopDefault($3RhHq$fullcalendarreact))), {
        plugins: [
            (0, ($parcel$interopDefault($3RhHq$fullcalendarlist)))
        ],
        locale: props.locale,
        initialView: "listMonth",
        ...fullCalendarProps
    });
};
var $f30a06264cfbf3f1$export$2e2bcd8739ae039 = $f30a06264cfbf3f1$var$DaysList;



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
