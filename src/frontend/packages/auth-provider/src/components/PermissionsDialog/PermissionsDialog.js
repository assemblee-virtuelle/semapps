import React from 'react';
import { Button } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';
import AddPermissionsForm from './AddPermissionsForm';
import EditPermissionsForm from './EditPermissionsForm';
import useAgents from '../useAgents';

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

const PermissionsDialog = ({ open, onClose, resourceId }) => {
  const classes = useStyles();
  const { agents, addPermission, removePermission } = useAgents(resourceId);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>Permissions sur la ressource</DialogTitle>
      <DialogContent className={classes.addForm}>
        <AddPermissionsForm agents={agents} addPermission={addPermission} />
      </DialogContent>
      <DialogContent className={classes.listForm}>
        <EditPermissionsForm agents={agents} addPermission={addPermission} removePermission={removePermission} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button label="ra.action.close" variant="inlined" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default PermissionsDialog;
