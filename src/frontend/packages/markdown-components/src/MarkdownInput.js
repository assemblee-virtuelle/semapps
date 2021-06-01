import React, { useState } from 'react';
import ReactMde from 'react-mde';
import Markdown from 'markdown-to-jsx';
import { useInput } from 'react-admin';
import { FormControl } from '@material-ui/core';

const MarkdownInput = props => {
  const [tab, setTab] = useState('write');
  const {
    input: { value, onChange }
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
    </FormControl>
  );
};

MarkdownInput.defaultProps = {
  addLabel: true
};

export default MarkdownInput;
