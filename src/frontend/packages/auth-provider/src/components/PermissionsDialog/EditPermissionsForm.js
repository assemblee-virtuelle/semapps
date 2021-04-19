import React from 'react';
import { List, makeStyles } from '@material-ui/core';
import AgentItem from './AgentItem';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper
  }
}));

const EditPermissionsForm = ({ agents, addPermission, removePermission }) => {
  const classes = useStyles();
  return (
    <List dense className={classes.list}>
      {Object.entries(agents).map(([agentId, agent]) => (
        <AgentItem key={agentId} agent={agent} addPermission={addPermission} removePermission={removePermission} />
      ))}
    </List>
  );
};

export default EditPermissionsForm;
