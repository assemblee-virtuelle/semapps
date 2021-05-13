import React from 'react';

const IdeaTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default IdeaTitle;
