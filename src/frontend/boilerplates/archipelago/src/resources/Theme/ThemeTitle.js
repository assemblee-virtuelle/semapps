import React from 'react';

const ThemeTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default ThemeTitle;
