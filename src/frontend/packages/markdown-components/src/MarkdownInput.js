import React, { useState } from 'react';
import ReactMde from 'react-mde';
import Markdown from 'markdown-to-jsx';
import { useInput, InputHelperText } from 'react-admin';
import { FormControl, FormHelperText } from '@material-ui/core';

const MarkdownInput = props => {
  const [tab, setTab] = useState('write');
  const {
    input: { value, onChange },
    meta: { error, touched }
  } = useInput(props);

  return (
    <FormControl fullWidth className="ra-input-mde">
      <ReactMde
        value={value}
        onChange={value => onChange(value)}
        onTabChange={tab => setTab(tab)}
        generateMarkdownPreview={async markdown => <Markdown>{markdown}</Markdown>}
        selectedTab={tab}
        {...props}
      />
      <FormHelperText error={!!error} margin="dense" variant="outlined">
        <InputHelperText error={error} helperText={props.helperText} touched={touched} />
      </FormHelperText>
    </FormControl>
  );
};

MarkdownInput.defaultProps = {
  addLabel: true
};

export default MarkdownInput;
