import React from 'react';
import { TextInput } from 'react-admin';

const MultiLinesInput = (props: any) => <TextInput
  multiline
  minRows={2}
  format={value => (value ? (Array.isArray(value) ? value.join('\n') : value) : '')}
  parse={value => value.split(/\r?\n/)}
  {...props}
/>;

export default MultiLinesInput;
