import React from 'react';
import PublicIcon from '@mui/icons-material/Public';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { CLASS_AGENT, GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT } from '../../constants';

const AgentIcon = ({
  agent
}: any) => {
  switch (agent.predicate) {
    case CLASS_AGENT:
      return agent.id === ANONYMOUS_AGENT ? <PublicIcon /> : <VpnLockIcon />;
    case USER_AGENT:
      return <PersonIcon />;
    case GROUP_AGENT:
      return <GroupIcon />;
    default:
      throw new Error(`Unknown agent predicate: ${agent.predicate}`);
  }
};

export default AgentIcon;
