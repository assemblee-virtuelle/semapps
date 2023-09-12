import React, { useCallback } from 'react';
import { useInput, FieldTitle, InputHelperText } from 'react-admin';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dateTimeFormatter, dateTimeParser } from './utils';

const Picker = ({
  PickerComponent,
  format = dateTimeFormatter,
  label,
  source,
  helperText,
  onBlur,
  onChange,
  onFocus,
  parse = dateTimeParser,
  validate,
  defaultValue,
  locale,
  pickerVariant = 'dialog',
  stringFormat = 'ISO',
  allowClear,
  ...rest
}) => {
  const {
    field,
    isRequired,
    fieldState: { error, isTouched },
  } = useInput({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    source,
    validate,
    ...rest,
  });

  const handleChange = useCallback((value) => {
    Date.parse(value)
      ? field.onChange(stringFormat === 'ISO' ? value.toISOString() : value.toString())
      : field.onChange(null);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <PickerComponent
        label={<FieldTitle label={label} source={source} isRequired={isRequired} />}
        error={!!(isTouched && error)}
        slotProps={{
          textField: {
            helperText: <InputHelperText touched={isTouched} error={error} helperText={helperText} />,
          },
        }}
        {...sanitizeRestProps(rest)}
        value={field.value ? new Date(field.value) : null}
        onChange={handleChange}
        onBlur={() =>
          field.onBlur(
            field.value
              ? stringFormat === 'ISO'
                ? new Date(field.value).toISOString()
                : new Date(field.value).toString()
              : null,
          )
        }
      />
    </LocalizationProvider>
  );
};

Picker.defaultProps = {
  isRequired: false,
  meta: { isTouched: false, error: false },
  locale: undefined, // Default to english
  parse: (value) => (value === '' ? null : value), // Avoid saving an empty string in the dataset
};

const sanitizeRestProps = ({
  allowEmpty,
  alwaysOn,
  component,
  defaultValue,
  format,
  formClassName,
  initialValue,
  initializeForm,
  input,
  isRequired,
  label,
  limitChoicesToValue,
  locale,
  meta,
  options,
  optionText,
  optionValue,
  parse,
  source,
  textAlign,
  translate,
  translateChoice,
  labelTime,
  ...rest
}) => rest;

export default Picker;
