import React from 'react';

const DocumentTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default DocumentTitle;
