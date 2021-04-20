import React, { useState } from 'react';
import { Button, usePermissionsOptimized } from 'react-admin';
import ShareIcon from '@material-ui/icons/Share';
import PermissionsDialog from './PermissionsDialog';
import { rightsToControl } from "../../constants";

const PermissionsButton = ({ record, resource }) => {
  const [showDialog, setShowDialog] = useState(false);
  const resourceId = resource || record.id || record['@id'];
  const { permissions } = usePermissionsOptimized(resourceId);

  if (resourceId && permissions && permissions.some(p => rightsToControl.includes(p['acl:mode']))) {
    return (
      <>
        <Button label="Permissions" onClick={() => setShowDialog(true)}>
          <ShareIcon/>
        </Button>
        <PermissionsDialog
          resourceId={resourceId}
          isContainer={!!resource}
          open={showDialog}
          onClose={() => setShowDialog(false)}
        />
      </>
    );
  } else {
    return null;
  }
};

export default PermissionsButton;
