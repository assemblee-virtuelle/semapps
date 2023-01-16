import React, { useMemo, useState } from 'react';
import ReactMde from 'react-mde';
import Markdown from 'markdown-to-jsx';
import { useInput, InputHelperText, Labeled, required, useTheme } from 'react-admin';
import { FormControl, FormHelperText } from '@mui/material';
import { styled } from '@mui/system';

const StyledFormControl = styled(FormControl)(() => {
  const [theme] = useTheme();  
  return ({
    color: 'blue',
    '&.validationError': {
      '& p': {
        color: theme.palette.error.main
      },
      '& .mde-text': {
        outline: '-webkit-focus-ring-color auto 1px',
        outlineOffset: 0,
        outlineColor: theme.palette.error.main,
        outlineStyle: 'auto',
        outlineWidth: 1
      },
      '& p.MuiFormHelperText-root': {
        color: theme.palette.error.main
      }
    }
})});

const MarkdownInput = props => {
  const { validate } = props;
  const isRequired = useMemo(
    () => !!validate && !![].concat(validate).find(v => v.toString() === required().toString()),
    [validate]
  );
  const [tab, setTab] = useState('write');
  const {
    field: { value, onChange },
    fieldState: { isDirty, invalid, error, isTouched }
  } = useInput(props);

  return (
    <StyledFormControl fullWidth className={`ra-input-mde ${ invalid ? 'validationError' : ''}`}>
      <Labeled {...props} isRequired={isRequired}>
        <ReactMde
          value={value}
          onChange={value => onChange(value)}
          onTabChange={tab => setTab(tab)}
          generateMarkdownPreview={async markdown => <Markdown>{markdown}</Markdown>}
          selectedTab={tab}
          {...props}
        />
      </Labeled>
      <FormHelperText error={isDirty && invalid} margin="dense" variant="outlined">
        <InputHelperText error={isDirty && invalid && error} helperText={props.helperText} touched={error || isTouched} />
      </FormHelperText>
    </StyledFormControl>
  );
};

export default MarkdownInput;
