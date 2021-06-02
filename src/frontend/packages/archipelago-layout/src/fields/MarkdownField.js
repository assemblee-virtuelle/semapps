import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * @deprecated Import it from @semapps/markdown-components instead
 */
const MarkDownField = ({ source, record }) =>
  record && record[source] ? <ReactMarkdown source={record[source]} /> : null;

MarkDownField.defaultProps = {
  addLabel: true
};

export default MarkDownField;
