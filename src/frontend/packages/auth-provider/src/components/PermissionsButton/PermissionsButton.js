import React, { useState } from 'react';
import { Button } from 'react-admin';
import ShareIcon from '@mui/icons-material/Share';
import { useCreateContainer } from '@semapps/semantic-data-provider';
import PermissionsDialog from './PermissionsDialog';

const PermissionsButton = ({ record, resource }) => {
  const [showDialog, setShowDialog] = useState(false);
  const createContainer = useCreateContainer(resource);
  const isContainer = !!resource;
  const uri = isContainer ? createContainer : record.id || record['@id'];
  return (
    <>
      <Button label="auth.action.permissions" onClick={() => setShowDialog(true)}>
        <ShareIcon />
      </Button>
      <PermissionsDialog uri={uri} isContainer={!!isContainer} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};

export default PermissionsButton;
