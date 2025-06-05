import { ComponentType } from "react";
import { TextInputProps } from "react-admin";
import { getPickersLocalization } from "@mui/x-date-pickers/locales/utils/getPickersLocalization";
import { Locale } from "date-fns";
import { JSX } from "react/jsx-runtime";
import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
type Props<PickerProps> = TextInputProps & Omit<PickerProps, 'format'> & {
    PickerComponent: ComponentType;
    locale?: Locale;
    translations?: ReturnType<typeof getPickersLocalization>;
    stringFormat?: string;
};
export const useFullCalendarProps: ({ label, startDate, endDate, linkType }: any) => {
    initialDate: Date;
    events: false | {
        id: any;
        title: any;
        start: any;
        end: any;
        url: string;
    }[];
    datesSet: ({ view }: any) => void;
    eventClick: ({ event, jsEvent }: any) => void;
};
export const CalendarList: (props: any) => JSX.Element;
export const DaysList: (props: any) => JSX.Element;
export const DateInput: <TDate>(props: Omit<Props<DatePickerProps<TDate>>, "PickerComponent">) => JSX.Element;
export const TimeInput: <TDate>(props: Omit<Props<TimePickerProps<TDate>>, "PickerComponent">) => JSX.Element;
export const DateTimeInput: <TDate>(props: Omit<Props<DateTimePickerProps<TDate>>, "PickerComponent">) => JSX.Element;

//# sourceMappingURL=index.d.ts.map
