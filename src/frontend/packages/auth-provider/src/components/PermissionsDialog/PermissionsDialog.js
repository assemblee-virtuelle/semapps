import React from 'react';
import { Button } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField } from '@material-ui/core';
import EditPermissionsForm from "./EditPermissionsForm";

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

  return(
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>Permissions sur la ressource</DialogTitle>
      <DialogContent className={classes.addForm}>
        <TextField
          label="Ajouter un utilisateur ou un groupe..."
          variant="filled"
          margin="dense"
          fullWidth
        />
      </DialogContent>
      <DialogContent className={classes.listForm}>
        <EditPermissionsForm resourceId={resourceId} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button label="ra.action.close" variant="inlined" onClick={onClose} />
      </DialogActions>
    </Dialog>
  )
};

export default PermissionsDialog;
