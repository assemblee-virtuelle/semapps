import React, { useState } from 'react';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { useInput } from 'react-admin';
import { FormControl } from '@material-ui/core';

const MarkdownInput = props => {
  const [tab, setTab] = useState('write');
  const { input: { value, onChange } } = useInput(props);

  return (
    <FormControl fullWidth className="ra-input-mde">
      <ReactMde
        value={value}
        onChange={value => onChange(value)}
        onTabChange={tab => setTab(tab)}
        generateMarkdownPreview={async markdown => <ReactMarkdown source={markdown} />}
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
