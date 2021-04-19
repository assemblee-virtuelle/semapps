import React from 'react';
import PublicIcon from '@material-ui/icons/Public';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import { CLASS_AGENT, GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT } from "../../constants";

const AgentIcon = ({ agent }) => {
  switch(agent.predicate) {
    case CLASS_AGENT:
      return agent.id === ANONYMOUS_AGENT ? <PublicIcon /> : <VpnLockIcon />;
    case USER_AGENT:
      return <PersonIcon />;
    case GROUP_AGENT:
      return <GroupIcon />
    default:
      throw new Error('Unknown agent predicate: ' + agent.predicate);
  }
}

export default AgentIcon;
