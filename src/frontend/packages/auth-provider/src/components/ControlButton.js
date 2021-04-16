import React, { useState } from 'react';
import { Button } from 'react-admin';
import ShareIcon from '@material-ui/icons/Share';
import PermissionsDialog from './PermissionsDialog/PermissionsDialog';

const ControlButton = ({ record }) => {
  const [showDialog, setShowDialog] = useState(false);
  if (!record) return null;
  return (
    <>
      <Button label="Permissions" onClick={() => setShowDialog(true)}>
        <ShareIcon />
      </Button>
      <PermissionsDialog
        resourceId={record.id || record['@id']}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default ControlButton;
