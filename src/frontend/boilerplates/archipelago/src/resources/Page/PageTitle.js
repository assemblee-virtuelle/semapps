import React from 'react';

const PageTitle = ({ record }) => {
  return <span>{record ? record['semapps:title'] : ''}</span>;
};

export default PageTitle;
