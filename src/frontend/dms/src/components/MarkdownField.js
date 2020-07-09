import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkDownField = ({ source, record }) => (
  record && record[source] && <ReactMarkdown source={record[source]} />
);

export default MarkDownField;
