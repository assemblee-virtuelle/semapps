import React, { useState } from 'react';
import { Button } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
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
    maxHeight: 200
  }
}));

const ControlButton = ({ record }) => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);

  return(
    <>
      <Button label="Permissions" onClick={() => setShowDialog(true)}><ShareIcon /></Button>
      <Dialog fullWidth open={showDialog} onClose={() => setShowDialog(false)}>
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
          <EditPermissionsForm record={record} />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button label="ra.action.close" variant="inlined" onClick={() => setShowDialog(false)} />
        </DialogActions>
      </Dialog>
    </>
  )
};

export default ControlButton;
