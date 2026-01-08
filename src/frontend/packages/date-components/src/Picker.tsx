/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
import { useCallback, ComponentType } from 'react';
import { useInput, InputHelperText, TextInputProps, useTranslateLabel } from 'react-admin';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getPickersLocalization } from '@mui/x-date-pickers/locales/utils/getPickersLocalization';
import { Locale } from 'date-fns';

export type Props<PickerProps> = TextInputProps &
  Omit<PickerProps, 'format'> & {
    PickerComponent: ComponentType;
    locale?: Locale;
    translations?: ReturnType<typeof getPickersLocalization>;
    stringFormat?: string;
  };

const Picker = <PickerProps,>({
  PickerComponent,
  label,
  source,
  helperText,
  fullWidth,
  onBlur,
  onChange,
  format,
  parse,
  validate,
  defaultValue,
  locale,
  translations,
  stringFormat = 'ISO',
  ...rest
}: Props<PickerProps>) => {
  const {
    field,
    isRequired,
    fieldState: { error, isTouched, invalid },
    formState: { isSubmitted }
  } = useInput({
    format,
    onBlur,
    onChange,
    parse,
    source,
    validate,
    defaultValue
  });

  const handleChange = useCallback(
    (value: Date) => {
      if (value instanceof Date) {
        field.onChange(stringFormat === 'ISO' ? value.toISOString() : value.toString());
      } else {
        field.onChange(null);
      }
    },
    [field, stringFormat]
  );

  const translateLabel = useTranslateLabel();
  const translatedLabel = (
    <span>
      {translateLabel({
        label,
        source
      })}
      {isRequired && <span aria-hidden="true">&thinsp;*</span>}
    </span>
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locale}
      localeText={translations?.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <PickerComponent
        label={translatedLabel}
        slotProps={{
          textField: {
            error: (isTouched || isSubmitted) && invalid,
            size: 'small',
            fullWidth,
            helperText: (
              // @ts-expect-error TS(2322): Type '{ touched: boolean; error: string | undefine... Remove this comment to see the full error message
              <InputHelperText touched={isTouched || isSubmitted} error={error?.message} helperText={helperText} />
            )
          }
        }}
        value={field.value ? new Date(field.value) : null}
        onChange={handleChange}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default Picker;
