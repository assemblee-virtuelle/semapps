import React from 'react';

const TaskTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default TaskTitle;
