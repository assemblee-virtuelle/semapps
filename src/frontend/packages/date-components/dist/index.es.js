import { jsx as $5Ihaz$jsx, jsxs as $5Ihaz$jsxs } from 'react/jsx-runtime';
import '@fullcalendar/core/vdom';
import { DatePicker as $5Ihaz$DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker as $5Ihaz$TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker as $5Ihaz$DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useCallback as $5Ihaz$useCallback, useMemo as $5Ihaz$useMemo } from 'react';
import {
  useInput as $5Ihaz$useInput,
  useTranslateLabel as $5Ihaz$useTranslateLabel,
  InputHelperText as $5Ihaz$InputHelperText,
  useListContext as $5Ihaz$useListContext,
  useCreatePath as $5Ihaz$useCreatePath
} from 'react-admin';
import { LocalizationProvider as $5Ihaz$LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns as $5Ihaz$AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import $5Ihaz$fullcalendarreact from '@fullcalendar/react';
import $5Ihaz$fullcalendardaygrid from '@fullcalendar/daygrid';
import { useTheme as $5Ihaz$useTheme } from '@mui/material';
import $5Ihaz$muistylesmakeStyles from '@mui/styles/makeStyles';
import { useSearchParams as $5Ihaz$useSearchParams, useNavigate as $5Ihaz$useNavigate } from 'react-router-dom';
import $5Ihaz$fullcalendarlist from '@fullcalendar/list';

/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/jsx-props-no-spreading */ // Solves bug with Vite in dev mode. Can be removed when we upgrade to FullCalendar v6
// See https://github.com/fullcalendar/fullcalendar-vue/issues/152

/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */

const $610808f89222f9cc$var$Picker = ({
  PickerComponent: PickerComponent,
  label: label,
  source: source,
  helperText: helperText,
  fullWidth: fullWidth,
  onBlur: onBlur,
  onChange: onChange,
  format: format,
  parse: parse,
  validate: validate,
  defaultValue: defaultValue,
  locale: locale,
  translations: translations,
  stringFormat: stringFormat = 'ISO',
  ...rest
}) => {
  const {
    field: field,
    isRequired: isRequired,
    fieldState: { error: error, isTouched: isTouched, invalid: invalid },
    formState: { isSubmitted: isSubmitted }
  } = (0, $5Ihaz$useInput)({
    format: format,
    onBlur: onBlur,
    onChange: onChange,
    parse: parse,
    source: source,
    validate: validate,
    defaultValue: defaultValue
  });
  const handleChange = (0, $5Ihaz$useCallback)(
    value => {
      if (value instanceof Date) field.onChange(stringFormat === 'ISO' ? value.toISOString() : value.toString());
      else field.onChange(null);
    },
    [field, stringFormat]
  );
  const translateLabel = (0, $5Ihaz$useTranslateLabel)();
  const translatedLabel = /*#__PURE__*/ (0, $5Ihaz$jsxs)('span', {
    children: [
      translateLabel({
        label: label,
        source: source
      }),
      isRequired &&
        /*#__PURE__*/ (0, $5Ihaz$jsx)('span', {
          'aria-hidden': 'true',
          children: '\u2009*'
        })
    ]
  });
  return /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $5Ihaz$LocalizationProvider), {
    dateAdapter: (0, $5Ihaz$AdapterDateFns),
    adapterLocale: locale,
    localeText: translations?.components.MuiLocalizationProvider.defaultProps.localeText,
    children: /*#__PURE__*/ (0, $5Ihaz$jsx)(PickerComponent, {
      label: translatedLabel,
      slotProps: {
        textField: {
          error: (isTouched || isSubmitted) && invalid,
          size: 'small',
          fullWidth: fullWidth,
          helperText: /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $5Ihaz$InputHelperText), {
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
var $610808f89222f9cc$export$2e2bcd8739ae039 = $610808f89222f9cc$var$Picker;

const $37245c02f9b1b006$var$useFullCalendarProps = ({
  label: label,
  startDate: startDate,
  endDate: endDate,
  linkType: linkType
}) => {
  const { data: data, isLoading: isLoading, resource: resource } = (0, $5Ihaz$useListContext)();
  const [searchParams, setSearchParams] = (0, $5Ihaz$useSearchParams)();
  const navigate = (0, $5Ihaz$useNavigate)();
  const createPath = (0, $5Ihaz$useCreatePath)();
  const query = new URLSearchParams(location.search);
  // Bypass the link in order to use React-Router
  const eventClick = (0, $5Ihaz$useCallback)(({ event: event, jsEvent: jsEvent }) => {
    jsEvent.preventDefault();
    navigate(event.url);
  }, []);
  // Change the query string when month change
  const datesSet = (0, $5Ihaz$useCallback)(
    ({ view: view }) => {
      setSearchParams(params => ({
        ...params,
        month: view.currentStart.getMonth() + 1,
        year: view.currentStart.getFullYear()
      }));
    },
    [setSearchParams]
  );
  const events = (0, $5Ihaz$useMemo)(
    () =>
      !isLoading &&
      data
        .filter(record => record)
        .map(record => ({
          id: record.id,
          title: typeof label === 'string' ? record[label] : label(record),
          start: typeof startDate === 'string' ? record[startDate] : startDate(record),
          end: typeof endDate === 'string' ? record[endDate] : endDate(record),
          url: createPath({
            resource: resource,
            id: record.id,
            type: linkType
          })
        })),
    [isLoading, data, resource, createPath]
  );
  return {
    initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
    events: events,
    datesSet: datesSet,
    eventClick: eventClick
  };
};
var $37245c02f9b1b006$export$2e2bcd8739ae039 = $37245c02f9b1b006$var$useFullCalendarProps;

const $abbcc02f55461290$var$useGlobalStyles = (0, $5Ihaz$muistylesmakeStyles)(theme => ({
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
const $abbcc02f55461290$var$CalendarList = props => {
  const theme = (0, $5Ihaz$useTheme)();
  const fullCalendarProps = (0, $37245c02f9b1b006$export$2e2bcd8739ae039)(props);
  $abbcc02f55461290$var$useGlobalStyles();
  return /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $5Ihaz$fullcalendarreact), {
    plugins: [(0, $5Ihaz$fullcalendardaygrid)],
    locale: props.locale,
    initialView: 'dayGridMonth',
    eventBackgroundColor: theme.palette.primary.main,
    ...fullCalendarProps
  });
};
$abbcc02f55461290$var$CalendarList.defaultProps = {
  linkType: 'edit'
};
var $abbcc02f55461290$export$2e2bcd8739ae039 = $abbcc02f55461290$var$CalendarList;

const $69d9f850452774a2$var$useGlobalStyles = (0, $5Ihaz$muistylesmakeStyles)(theme => ({
  '@global': {
    '.fc-button': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      border: 'none !important',
      opacity: '1 !important'
    }
  }
}));
const $69d9f850452774a2$var$DaysList = props => {
  const fullCalendarProps = (0, $37245c02f9b1b006$export$2e2bcd8739ae039)(props);
  $69d9f850452774a2$var$useGlobalStyles();
  return /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $5Ihaz$fullcalendarreact), {
    plugins: [(0, $5Ihaz$fullcalendarlist)],
    locale: props.locale,
    initialView: 'listMonth',
    ...fullCalendarProps
  });
};
$69d9f850452774a2$var$DaysList.defaultProps = {
  linkType: 'edit'
};
var $69d9f850452774a2$export$2e2bcd8739ae039 = $69d9f850452774a2$var$DaysList;

const $582746363a8b71b9$export$7edc06cf1783b30f = props =>
  /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $610808f89222f9cc$export$2e2bcd8739ae039), {
    PickerComponent: (0, $5Ihaz$DatePicker),
    ...props
  });
const $582746363a8b71b9$export$a1af6f79df847fac = props =>
  /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $610808f89222f9cc$export$2e2bcd8739ae039), {
    PickerComponent: (0, $5Ihaz$TimePicker),
    ...props
  });
const $582746363a8b71b9$export$183478aa40b5df1 = props =>
  /*#__PURE__*/ (0, $5Ihaz$jsx)((0, $610808f89222f9cc$export$2e2bcd8739ae039), {
    PickerComponent: (0, $5Ihaz$DateTimePicker),
    ...props
  });

export {
  $582746363a8b71b9$export$7edc06cf1783b30f as DateInput,
  $582746363a8b71b9$export$a1af6f79df847fac as TimeInput,
  $582746363a8b71b9$export$183478aa40b5df1 as DateTimeInput,
  $abbcc02f55461290$export$2e2bcd8739ae039 as CalendarList,
  $69d9f850452774a2$export$2e2bcd8739ae039 as DaysList,
  $37245c02f9b1b006$export$2e2bcd8739ae039 as useFullCalendarProps
};
//# sourceMappingURL=index.es.js.map
