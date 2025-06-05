import React, { useState } from 'react';
import { Button, useRecordContext, useResourceContext } from 'react-admin';
import ShareIcon from '@mui/icons-material/Share';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import PermissionsDialog from './PermissionsDialog';

const PermissionsButton = ({ isContainer = false }) => {
  const record = useRecordContext();
  const resource = useResourceContext();
  const [showDialog, setShowDialog] = useState(false);
  const createContainer = useCreateContainerUri(resource);
  const uri = isContainer ? createContainer : record?.id || record?.['@id'];
  return (
    <>
      <Button label="auth.action.permissions" onClick={() => setShowDialog(true)}>
        <ShareIcon />
      </Button>
      <PermissionsDialog uri={uri} isContainer={isContainer} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};

export default PermissionsButton;
