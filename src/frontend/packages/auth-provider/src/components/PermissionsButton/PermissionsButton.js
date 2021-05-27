import React, { useState } from 'react';
import { Button } from 'react-admin';
import ShareIcon from '@material-ui/icons/Share';
import PermissionsDialog from './PermissionsDialog';

const PermissionsButton = ({ record, resource }) => {
  const [showDialog, setShowDialog] = useState(false);
  const isContainer = !!resource;
  const resourceId = isContainer ? resource : record.id || record['@id'];
  return (
    <>
      <Button label="auth.action.permissions" onClick={() => setShowDialog(true)}>
        <ShareIcon />
      </Button>
      <PermissionsDialog
        resourceId={resourceId}
        isContainer={!!resource}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default PermissionsButton;
