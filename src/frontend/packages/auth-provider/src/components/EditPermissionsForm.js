import React, { useEffect, useCallback, useState } from 'react';
import { usePermissionsOptimized, useAuthProvider } from 'react-admin';
import { List, makeStyles } from '@material-ui/core';
import AgentItem from "./AgentItem";
import { agentsDefinitions } from "../constants";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);
const applyToAgentClass = (p, agentClass) => Array.isArray(p['acl:agentClass']) ? p['acl:agentClass'].includes(agentClass) : p['acl:agentClass'] === agentClass;
const appendPermission = (agents, agentId, agentType, p) => {
  if( agents[agentId] ) {
    agents[agentId].permissions.push(p);
  } else {
    agents[agentId] = {
      id: agentId,
      type: agentType,
      ...agentsDefinitions[agentType],
      permissions: [p]
    };
  }
};

const EditPermissionsForm = ({ record }) => {
  const classes = useStyles();
  const [ agents, setAgents ] = useState({});
  const { permissions } = usePermissionsOptimized(record.id);
  const authProvider = useAuthProvider();

  useEffect(() => {
    let returnValue = {};
    for( let p of permissions ) {
      if( applyToAgentClass(p, 'foaf:Agent') ) {
        appendPermission(returnValue, 'foaf:Agent', 'anon', p['acl:mode']);
      }
      if( applyToAgentClass(p, 'acl:AuthenticatedAgent') ) {
        appendPermission(returnValue, 'acl:AuthenticatedAgent', 'anyUser', p['acl:mode']);
      }
      if( p['acl:agent'] ) {
        defaultToArray(p['acl:agent']).forEach(userUri => appendPermission(returnValue, userUri, 'user', p['acl:mode']));
      }
      if( p['acl:agentGroup'] ) {
        defaultToArray(p['acl:agentGroup']).forEach(groupUri => appendPermission(returnValue, groupUri, 'group', p['acl:mode']));
      }
    }
    setAgents(returnValue);
  }, [permissions]);

  const addPermission = useCallback((agentId, agentType, mode) => {
    authProvider
      .addPermission(record.id, agentId, agentType, mode)
      .then(result => {
        if( result ) {
          // appendPermission(agents, agentId, agentType, mode);
        }
      });
  }, [agents]);

  return(
    <List dense className={classes.list}>
      {Object.entries(agents).map(([agentId, agent]) => (
        <AgentItem key={agentId} agent={agent} addPermission={addPermission} />
      ))}
    </List>
  )
};

export default EditPermissionsForm;
