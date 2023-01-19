import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import makeStyles from '@mui/styles/makeStyles';
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
      <DeleteButtonWithPermissions mutationMode="undoable" />
    </Toolbar>
  );
};

export default EditToolbarWithPermissions;
