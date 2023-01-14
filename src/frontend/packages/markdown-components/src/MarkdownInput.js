import React, { useMemo, useState } from 'react';
import ReactMde from 'react-mde';
import Markdown from 'markdown-to-jsx';
import { useInput, InputHelperText, Labeled, required, useTheme } from 'react-admin';
import { FormControl, FormHelperText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => { const [theme] = useTheme(); return ({
  validationError: {
    '& label': {
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
  const classes = useStyles();
  const { validate } = props;
  const isRequired = useMemo(
    () => !!validate && !![].concat(validate).find(v => v.toString() === required().toString()),
    [validate]
  );
  const [tab, setTab] = useState('write');
  const {
    input: { value, onChange },
    meta: { modified, invalid, error, touched }
  } = useInput(props);

  return (
    <FormControl fullWidth className={`ra-input-mde ${modified && invalid ? classes.validationError : ''}`}>
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
      <FormHelperText error={modified && invalid} margin="dense" variant="outlined">
        <InputHelperText error={modified && invalid && error} helperText={props.helperText} touched={error || touched} />
      </FormHelperText>
    </FormControl>
  );
};

export default MarkdownInput;
