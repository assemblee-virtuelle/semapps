import React from 'react';
import { SaveButton, Toolbar, DeleteButton } from 'react-admin';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  toolbar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

const EditToolbarWithPermissions = ({ hasDelete, ...rest }) => {
  const classes = useStyles();
  return (
    <Toolbar {...rest} className={classes.toolbar}>
      <SaveButton />
      {hasDelete && <DeleteButton undoable={false} />}
    </Toolbar>
  );
};

export default EditToolbarWithPermissions;
