import { useEffect, useCallback, useState } from 'react';
import { usePermissionsOptimized, useAuthProvider } from 'react-admin';
import { defaultToArray } from '../utils';
import { CLASS_AGENT, GROUP_AGENT, USER_AGENT, defaultAgents } from '../constants';

const appendPermission = (agents, agentId, predicate, mode) => {
  if (agents[agentId]) {
    agents[agentId].permissions.push(mode);
  } else {
    agents[agentId] = {
      id: agentId,
      predicate,
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
        if (p[CLASS_AGENT]) {
          defaultToArray(p[CLASS_AGENT]).forEach(agentId => appendPermission(result, agentId, CLASS_AGENT, p['acl:mode']));
        }
        if (p[USER_AGENT]) {
          defaultToArray(p[USER_AGENT]).forEach(userUri => appendPermission(result, userUri, USER_AGENT, p['acl:mode']));
        }
        if (p[GROUP_AGENT]) {
          defaultToArray(p[GROUP_AGENT]).forEach(groupUri =>
            appendPermission(result, groupUri, GROUP_AGENT, p['acl:mode'])
          );
        }
      }
    }
    setAgents(result);
  }, [permissions]);

  const addPermission = useCallback(
    (agentId, predicate, mode) => {
      const prevAgents = { ...agents };
      setAgents({
        ...agents,
        [agentId]: {
          id: agentId,
          predicate,
          permissions: agents[agentId] ? [...agents[agentId]?.permissions, mode] : [mode]
        }
      });
      authProvider.addPermission(resourceId, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, resourceId, authProvider]
  );

  const removePermission = useCallback(
    (agentId, predicate, mode) => {
      const prevAgents = { ...agents };
      setAgents(
        Object.fromEntries(
          Object.entries(agents)
            .map(([key, agent]) => {
              if (agent.id === agentId) {
                agent.permissions = agent.permissions.filter(m => m !== mode);
              }
              return [key, agent];
            })
            // Remove agents if they have no permissions (except if they are class agents)
            .filter(
              ([_, agent]) =>
                agent.predicate === CLASS_AGENT || agent.permissions.length > 0
            )
        )
      );
      authProvider.removePermission(resourceId, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, resourceId, authProvider]
  );

  return { agents, addPermission, removePermission };
};

export default useAgents;
