import React from 'react';
import { List } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AgentItem from './AgentItem';
import { useTheme } from 'react-admin';

const useStyles = makeStyles(() => { const [theme] = useTheme(); return ({
  list: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper
  }
})});

const EditPermissionsForm = ({ isContainer, agents, addPermission, removePermission }) => {
  const classes = useStyles();
  return (
    <List dense className={classes.list}>
      {Object.entries(agents).map(([agentId, agent]) => (
        <AgentItem
          key={agentId}
          isContainer={isContainer}
          agent={agent}
          addPermission={addPermission}
          removePermission={removePermission}
        />
      ))}
    </List>
  );
};

export default EditPermissionsForm;
