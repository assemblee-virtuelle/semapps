import React from 'react';

const TypeTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default TypeTitle;
