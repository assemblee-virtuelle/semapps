import { useEffect, useCallback, useState } from 'react';
import { usePermissionsOptimized, useAuthProvider } from 'react-admin';
import { agentsDefinitions } from '../constants';
import { defaultToArray } from '../utils';

const defaultAgents = {
  'foaf:Agent': {
    id: 'foaf:Agent',
    type: 'anon',
    ...agentsDefinitions.anon,
    permissions: []
  },
  'acl:AuthenticatedAgent': {
    id: 'acl:AuthenticatedAgent',
    type: 'anyUser',
    ...agentsDefinitions.anyUser,
    permissions: []
  }
};

const applyToAgentClass = (p, agentClass) =>
  Array.isArray(p['acl:agentClass']) ? p['acl:agentClass'].includes(agentClass) : p['acl:agentClass'] === agentClass;
const appendPermission = (agents, agentId, agentType, mode) => {
  if (agents[agentId]) {
    agents[agentId].permissions.push(mode);
  } else {
    agents[agentId] = {
      id: agentId,
      type: agentType,
      ...agentsDefinitions[agentType],
      permissions: [mode]
    };
  }
};

const useAgents = resourceId => {
  const { permissions } = usePermissionsOptimized(resourceId);
  const authProvider = useAuthProvider();
  const [agents, setAgents] = useState({});

  // Format list of authorized agents, based on the permissions returned for the resource
  useEffect(() => {
    let result = defaultAgents;
    if (permissions) {
      for (let p of permissions) {
        if (applyToAgentClass(p, 'foaf:Agent')) {
          appendPermission(result, 'foaf:Agent', 'anon', p['acl:mode']);
        }
        if (applyToAgentClass(p, 'acl:AuthenticatedAgent')) {
          appendPermission(result, 'acl:AuthenticatedAgent', 'anyUser', p['acl:mode']);
        }
        if (p['acl:agent']) {
          defaultToArray(p['acl:agent']).forEach(userUri => appendPermission(result, userUri, 'user', p['acl:mode']));
        }
        if (p['acl:agentGroup']) {
          defaultToArray(p['acl:agentGroup']).forEach(groupUri =>
            appendPermission(result, groupUri, 'group', p['acl:mode'])
          );
        }
      }
    }
    setAgents(result);
  }, [permissions]);

  const addPermission = useCallback(
    (agentId, agentType, mode) => {
      const prevAgents = agents;
      setAgents({
        ...agents,
        [agentId]: {
          id: agentId,
          type: agentType,
          ...agentsDefinitions[agentType],
          permissions: agents[agentId] ? [...agents[agentId]?.permissions, mode] : [mode]
        }
      });
      authProvider.addPermission(resourceId, agentId, agentType, mode).catch(() => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, resourceId, authProvider]
  );

  const removePermission = useCallback(
    (agentId, agentType, mode) => {
      const prevAgents = agents;
      setAgents(
        Object.fromEntries(
          Object.entries(agents)
            .map(([key, agent]) => {
              if (agent.id === agentId) {
                agent.permissions = agent.permissions.filter(m => m !== mode);
              }
              return [key, agent];
            })
            .filter(
              ([_, agent]) =>
                agent.id === 'foaf:Agent' || agent.id === 'acl:AuthenticatedAgent' || agent.permissions.length > 0
            )
        )
      );
      authProvider.removePermission(resourceId, agentId, agentType, mode).catch(() => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, resourceId, authProvider]
  );

  return { agents, addPermission, removePermission };
};

export default useAgents;
