import React from 'react';

const RoleTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default RoleTitle;
