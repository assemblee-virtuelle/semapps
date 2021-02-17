import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FieldTitle, useInput, useTranslate } from 'ra-core';
import { DateRangeDelimiter, LocalizationProvider } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

const RangePicker = ({
  Component,
  options,
  labelStart,
  labelEnd,
  sourceStart,
  sourceEnd,
  resource,
  className,
  isRequired,
  providerOptions,
  fullWidth,
  onChange
}) => {
  const translate = useTranslate();
  const { input: inputStart } = useInput({ source: sourceStart });
  const { input: inputEnd } = useInput({ source: sourceEnd });

  const handleChange = useCallback(
    value => {
      onChange(value);
      if (null !== value[0])
        Date.parse(value[0]) ? inputStart.onChange(value[0].toISOString()) : inputStart.onChange(null);
      if (null !== value[1]) Date.parse(value[1]) ? inputEnd.onChange(value[1].toISOString()) : inputEnd.onChange(null);
    },
    [inputStart, inputEnd]
  );

  return (
    <div className="picker">
      <LocalizationProvider {...providerOptions}>
        <Component
          {...options}
          startText={<FieldTitle label={labelStart} source={sourceStart} resource={resource} isRequired={isRequired} />}
          endText={<FieldTitle label={labelEnd} source={sourceEnd} resource={resource} isRequired={isRequired} />}
          margin="normal"
          className={className}
          value={[
            inputStart.value ? new Date(inputStart.value) : null,
            inputEnd.value ? new Date(inputEnd.value) : null
          ]}
          clearText={translate('ra.action.clear_input_value')}
          cancelText={translate('ra.action.cancel')}
          onChange={date => handleChange(date)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} margin="normal" variant="filled" fullWidth={fullWidth} />
              <DateRangeDelimiter> to </DateRangeDelimiter>
              <TextField {...endProps} margin="normal" variant="filled" fullWidth={fullWidth} />
            </>
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

RangePicker.propTypes = {
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  labelStart: PropTypes.string,
  labelEnd: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  resource: PropTypes.string,
  sourceStart: PropTypes.string,
  sourceEnd: PropTypes.string,
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

RangePicker.defaultProps = {
  input: {},
  isRequired: false,
  meta: { touched: false, error: false },
  options: {},
  resource: '',
  sourceStart: '',
  sourceEnd: '',
  labelTime: '',
  className: '',
  providerOptions: {
    dateAdapter: DateFnsUtils,
    locale: undefined
  },
  fullWidth: false,
  onChange: () => {}
};

export default RangePicker;
