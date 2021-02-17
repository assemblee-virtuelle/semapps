import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FieldTitle, useInput, useTranslate } from 'react-admin';
import { LocalizationProvider } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

const Picker = ({
  Component,
  options,
  label,
  source,
  resource,
  className,
  isRequired,
  providerOptions,
  fullWidth,
  onChange
}) => {
  const translate = useTranslate();
  const { input, meta } = useInput({ source });
  const [isOpen, setIsOpen] = useState(false);
  const { touched, error } = meta;

  const handleChange = useCallback(
    value => {
      onChange(value);
      Date.parse(value) ? input.onChange(value.toISOString()) : input.onChange(null);
    },
    [input]
  );

  return (
    <div className="picker">
      <LocalizationProvider {...providerOptions}>
        <Component
          {...options}
          label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
          margin="normal"
          error={!!(touched && error)}
          helperText={false}
          className={className}
          value={input.value ? new Date(input.value) : null}
          clearText={translate('ra.action.clear_input_value')}
          cancelText={translate('ra.action.cancel')}
          onChange={date => handleChange(date)}
          onBlur={() => input.onBlur(input.value ? new Date(input.value).toISOString() : null)}
          renderInput={props => <TextField {...props} margin="normal" variant="filled" fullWidth={fullWidth} />}
          // open={isOpen}
          // KeyboardButtonProps={{
          //   onFocus: e => {
          //     setIsOpen(true);
          //   }
          // }}
          // PopoverProps={{
          //   disableRestoreFocus: true,
          //   onClose: () => {
          //     setIsOpen(false);
          //   }
          // }}
          // InputProps={{
          //   onFocus: () => {
          //     setIsOpen(true);
          //   }
          // }}
        />
      </LocalizationProvider>
    </div>
  );
};

Picker.propTypes = {
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
  labelTime: PropTypes.string,
  className: PropTypes.string,
  providerOptions: PropTypes.shape({
    dateAdapter: PropTypes.func,
    dateLibInstance: PropTypes.func,
    locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  }),
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func
};

Picker.defaultProps = {
  input: {},
  isRequired: false,
  meta: { touched: false, error: false },
  options: {},
  resource: '',
  source: '',
  labelTime: '',
  className: '',
  providerOptions: {
    dateAdapter: DateFnsUtils,
    locale: undefined
  },
  fullWidth: false,
  onChange: () => {}
};

export default Picker;
