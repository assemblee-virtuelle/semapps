import React, { useState, useMemo } from 'react';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import { useInput } from 'react-admin';
import FormControl from '@material-ui/core/FormControl';

const MarkdownInput = props => {
  const [tab, setTab] = useState('write');

  const {
    input: { value, onChange }
  } = useInput(props);

  const converter = useMemo(() => new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
  }), []);

  return (
    <FormControl fullWidth className="ra-input-mde">
      <ReactMde
        value={value}
        onChange={value => onChange(value)}
        onTabChange={tab => setTab(tab)}
        generateMarkdownPreview={async markdown => converter.makeHtml(markdown)}
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
