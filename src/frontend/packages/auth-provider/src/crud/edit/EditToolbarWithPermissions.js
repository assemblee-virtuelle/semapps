import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import DeleteButtonWithPermissions from './DeleteButtonWithPermissions';

const useStyles = makeStyles(() => ({
  toolbar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

const EditToolbarWithPermissions = props => {
  const classes = useStyles();
  return (
    <Toolbar {...props} className={classes.toolbar}>
      <SaveButton />
      <DeleteButtonWithPermissions undoable={false} />}
    </Toolbar>
  );
};

export default EditToolbarWithPermissions;
