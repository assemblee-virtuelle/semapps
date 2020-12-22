import React from 'react';

const EventTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default EventTitle;
