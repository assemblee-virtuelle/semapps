import * as React from 'react';
import { ListBase, useListContext, Link } from 'react-admin';
import { Button, Box } from '@material-ui/core';

const ButtonsList = () => {
  const { ids, data } = useListContext();
  return ids
    .filter(id => data[id]['pair:containedIn'] === 'http://localhost:3000/folders/fondamentaux')
    .map(id => (
      <Box key={id} mb={1}>
        <Link to={'/Document/' + encodeURIComponent(data[id]['@id']) + '/show'}>
          <Button variant="contained" color="primary" fullWidth>
            {data[id]['pair:label']}
          </Button>
        </Link>
      </Box>
    ));
};

export const DocumentsFolder = ({ folderId }) => (
  <ListBase resource="Document" basePath="/Document">
    <ButtonsList folderId={folderId} />
  </ListBase>
);

export default DocumentsFolder;
