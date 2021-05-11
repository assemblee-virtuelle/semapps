import React from 'react';

const GroupTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default GroupTitle;
