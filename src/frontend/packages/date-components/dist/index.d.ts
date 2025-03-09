import { ComponentType } from "react";
import { TextInputProps } from "react-admin";
import { getPickersLocalization } from "@mui/x-date-pickers/locales/utils/getPickersLocalization";
import { Locale } from "date-fns";
import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
type Props<PickerProps> = TextInputProps & Omit<PickerProps, 'format'> & {
    PickerComponent: ComponentType;
    locale?: Locale;
    translations?: ReturnType<typeof getPickersLocalization>;
    stringFormat?: string;
};
export function useFullCalendarProps({ label, startDate, endDate, linkType }: {
    label: any;
    startDate: any;
    endDate: any;
    linkType?: string | undefined;
}): {
    initialDate: Date;
    events: false | {
        id: any;
        title: any;
        start: any;
        end: any;
        url: string;
    }[];
    datesSet: ({ view }: {
        view: any;
    }) => void;
    eventClick: ({ event, jsEvent }: {
        event: any;
        jsEvent: any;
    }) => void;
};
export function CalendarList(props: any): import("react/jsx-runtime").JSX.Element;
export function DaysList(props: any): import("react/jsx-runtime").JSX.Element;
export const DateInput: <TDate>(props: Omit<Props<DatePickerProps<TDate>>, "PickerComponent">) => import("react/jsx-runtime").JSX.Element;
export const TimeInput: <TDate>(props: Omit<Props<TimePickerProps<TDate>>, "PickerComponent">) => import("react/jsx-runtime").JSX.Element;
export const DateTimeInput: <TDate>(props: Omit<Props<DateTimePickerProps<TDate>>, "PickerComponent">) => import("react/jsx-runtime").JSX.Element;

//# sourceMappingURL=index.d.ts.map
