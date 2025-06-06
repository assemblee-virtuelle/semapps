import React from 'react';
import { Button, useTranslate } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AddPermissionsForm from './AddPermissionsForm';
import EditPermissionsForm from './EditPermissionsForm';
import useAgents from '../../hooks/useAgents';

const useStyles = makeStyles(() => ({
  title: {
    paddingBottom: 8
  },
  actions: {
    padding: 15
  },
  addForm: {
    paddingTop: 0
  },
  listForm: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    maxHeight: 210
  }
}));

const PermissionsDialog = ({ open, onClose, uri, isContainer }: any) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { agents, addPermission, removePermission } = useAgents(uri);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        {translate(isContainer ? 'auth.dialog.container_permissions' : 'auth.dialog.resource_permissions')}
      </DialogTitle>
      <DialogContent className={classes.addForm}>
        <AddPermissionsForm agents={agents} addPermission={addPermission} />
      </DialogContent>
      <DialogContent className={classes.listForm}>
        <EditPermissionsForm
          isContainer={isContainer}
          agents={agents}
          addPermission={addPermission}
          removePermission={removePermission}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button label="ra.action.close" variant="text" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default PermissionsDialog;
