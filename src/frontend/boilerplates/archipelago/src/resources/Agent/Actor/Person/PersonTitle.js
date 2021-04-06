import React from 'react';

const PersonTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default PersonTitle;
