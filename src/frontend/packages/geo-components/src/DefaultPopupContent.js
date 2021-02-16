import React from 'react';
import { ShowButton, EditButton, useResourceDefinition } from 'react-admin';
import { Typography } from '@material-ui/core';

const DefaultPopupContent = ({ record, basePath }) => {
  const resourceDefinition = useResourceDefinition({});
  return (
    <>
      {record.label && <Typography variant="h5">{record.label}</Typography>}
      {record.description && (
        <Typography>
          {record.description.length > 150 ? record.description.substring(0, 150) + '...' : record.description}
        </Typography>
      )}
      {resourceDefinition.hasShow && <ShowButton basePath={basePath} record={record} />}
      {resourceDefinition.hasEdit && <EditButton basePath={basePath} record={record} />}
    </>
  );
};

export default DefaultPopupContent;
