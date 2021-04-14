import React, { useMemo } from 'react';
import { usePermissionsOptimized } from 'react-admin';
import { List, makeStyles, TextField } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import AgentItem from "./AgentItem";

const agentsDefinitions = {
  anon: {
    label: 'Tous les utilisateurs',
    icon: <PublicIcon />
  },
  anyUser: {
    label: 'Utilisateurs connectés',
    icon: <VerifiedUserIcon/>
  },
  user: {
    icon: <PersonIcon />
  },
  group: {
    icon: <GroupIcon />
  }
};

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
  const { permissions } = usePermissionsOptimized(record.id);

  const agents = useMemo(() => {
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
    return returnValue;
  }, [permissions]);

  return(
    <List dense className={classes.list}>
      {Object.entries(agents).map(([agentId, agent]) => (
        <AgentItem key={agentId} agent={agent} />
      ))}
    </List>
  )
};

export default EditPermissionsForm;
