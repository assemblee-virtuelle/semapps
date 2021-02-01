import React from 'react';

const SkillTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default SkillTitle;
