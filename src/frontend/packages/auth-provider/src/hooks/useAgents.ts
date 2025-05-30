import { useEffect, useCallback, useState } from 'react';
import { usePermissions, useAuthProvider } from 'react-admin';
import { defaultToArray } from '../utils';
import { CLASS_AGENT, GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT, AUTHENTICATED_AGENT } from '../constants';

const useAgents = uri => {
  const { permissions } = usePermissions({ uri });
  const authProvider = useAuthProvider();
  const [agents, setAgents] = useState({});

  // Format list of authorized agents, based on the permissions returned for the resource
  useEffect(() => {
    const result = {
      [ANONYMOUS_AGENT]: {
        id: ANONYMOUS_AGENT,
        predicate: CLASS_AGENT,
        permissions: []
      },
      [AUTHENTICATED_AGENT]: {
        id: AUTHENTICATED_AGENT,
        predicate: CLASS_AGENT,
        permissions: []
      }
    };

    const appendPermission = (agentId, predicate, mode) => {
      if (result[agentId]) {
        result[agentId].permissions.push(mode);
      } else {
        result[agentId] = {
          id: agentId,
          predicate,
          permissions: [mode]
        };
      }
    };

    if (permissions) {
      for (const p of permissions) {
        if (p[CLASS_AGENT]) {
          defaultToArray(p[CLASS_AGENT]).forEach(agentId => appendPermission(agentId, CLASS_AGENT, p['acl:mode']));
        }
        if (p[USER_AGENT]) {
          defaultToArray(p[USER_AGENT]).forEach(userUri => appendPermission(userUri, USER_AGENT, p['acl:mode']));
        }
        if (p[GROUP_AGENT]) {
          defaultToArray(p[GROUP_AGENT]).forEach(groupUri => appendPermission(groupUri, GROUP_AGENT, p['acl:mode']));
        }
      }
      setAgents(result);
    }
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
      authProvider.addPermission(uri, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
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
            .filter(([_, agent]) => agent.predicate === CLASS_AGENT || agent.permissions.length > 0)
        )
      );
      authProvider.removePermission(uri, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
  );

  return { agents, addPermission, removePermission };
};

export default useAgents;
