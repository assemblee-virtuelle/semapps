import React from 'react';
import { ShowButton, EditButton, useResourceDefinition } from 'react-admin';
import { Typography } from '@mui/material';

const DefaultPopupContent = ({ record }) => {
  const resourceDefinition = useResourceDefinition({});
  return (
    <>
      {record.label && <Typography variant="h5">{record.label}</Typography>}
      {record.description && (
        <Typography>
          {record.description.length > 150 ? record.description.substring(0, 150) + '...' : record.description}
        </Typography>
      )}
        {resourceDefinition.hasShow && <ShowButton record={record} />}
        {resourceDefinition.hasEdit && <EditButton record={record} />}
    </>
  );
};

export default DefaultPopupContent;
