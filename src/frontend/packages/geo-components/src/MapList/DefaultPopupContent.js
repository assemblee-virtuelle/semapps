import React from 'react';
import { ShowButton, EditButton, useResourceDefinition, useRecordContext } from 'react-admin';
import { Typography } from '@mui/material';

const DefaultPopupContent = () => {
  const record = useRecordContext();
  const resourceDefinition = useResourceDefinition({});
  if (!record) return null;
  return (
    <>
      {record.label && <Typography variant="h5">{record.label}</Typography>}
      {record.description && (
        <Typography>
          {record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description}
        </Typography>
      )}
      {resourceDefinition.hasShow && <ShowButton />}
      {resourceDefinition.hasEdit && <EditButton />}
    </>
  );
};

export default DefaultPopupContent;
