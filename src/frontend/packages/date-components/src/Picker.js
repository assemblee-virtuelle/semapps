import React, { useCallback } from 'react';
import { useInput, useTranslate, FieldTitle } from 'react-admin';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { dateTimeFormatter, dateTimeParser } from './utils';

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

  return (
    <MuiPickersUtilsProvider utils={utils || DateFnsUtils} locale={locale}>
      <PickerComponent
        id={id}
        InputLabelProps={{
          shrink: true
        }}
        label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        variant={pickerVariant}
        inputVariant={variant}
        margin={margin}
        error={!!(touched && error)}
        helperText=" "
        clearLabel={translate('ra.action.clear_input_value')}
        cancelLabel={translate('ra.action.cancel')}
        {...options}
        {...sanitizeRestProps(rest)}
        value={input.value ? new Date(input.value) : null}
        onChange={date => handleChange(date)}
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
  }
};

export default Picker;
