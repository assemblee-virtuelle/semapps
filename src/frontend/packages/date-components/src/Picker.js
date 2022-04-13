import React, { useCallback } from 'react';
import { useInput, useTranslate, FieldTitle, InputHelperText } from 'react-admin';
import { IconButton } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { dateTimeFormatter, dateTimeParser } from './utils';
import ClearIcon from "@material-ui/icons/Clear";

const sanitizeRestProps = ({
  allowEmpty,
  alwaysOn,
  basePath,
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
  record,
  resource,
  source,
  textAlign,
  translate,
  translateChoice,
  labelTime,
  ...rest
}) => rest;

const Picker = ({
  PickerComponent,
  format = dateTimeFormatter,
  label,
  options,
  source,
  resource,
  helperText,
  margin = 'dense',
  onBlur,
  onChange,
  onFocus,
  parse = dateTimeParser,
  validate,
  variant = 'filled',
  defaultValue,
  providerOptions: { utils, locale },
  pickerVariant = 'dialog',
  stringFormat = 'ISO',
  allowClear,
  ...rest
}) => {
  const translate = useTranslate();
  const {
    id,
    input,
    isRequired,
    meta: { error, touched }
  } = useInput({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    resource,
    source,
    validate,
    /* type: 'datetime-local', */
    ...rest
  });

  const handleChange = useCallback(value => {
    Date.parse(value)
      ? input.onChange(stringFormat === 'ISO' ? value.toISOString() : value.toString())
      : input.onChange(null);
  }, []);

  const handleClear = useCallback(e => {
    e.stopPropagation();
    input.onChange(null);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={utils || DateFnsUtils} locale={locale}>
      <PickerComponent
        id={id}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          endAdornment: allowClear ? (
            <IconButton onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          ) : undefined
        }}
        label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        variant={pickerVariant}
        inputVariant={variant}
        margin={margin}
        error={!!(touched && error)}
        helperText={<InputHelperText touched={touched} error={error} helperText={helperText} />}
        clearLabel={translate('ra.action.clear_input_value')}
        cancelLabel={translate('ra.action.cancel')}
        {...options}
        {...sanitizeRestProps(rest)}
        value={input.value ? new Date(input.value) : null}
        onChange={handleChange}
        onBlur={() =>
          input.onBlur(
            input.value
              ? stringFormat === 'ISO'
                ? new Date(input.value).toISOString()
                : new Date(input.value).toString()
              : null
          )
        }
      />
    </MuiPickersUtilsProvider>
  );
};

Picker.defaultProps = {
  isRequired: false,
  meta: { touched: false, error: false },
  options: {},
  providerOptions: {
    utils: DateFnsUtils,
    locale: undefined
  },
  // Avoid saving an empty string in the dataset
  parse: value => value === '' ? null : value
};

export default Picker;
