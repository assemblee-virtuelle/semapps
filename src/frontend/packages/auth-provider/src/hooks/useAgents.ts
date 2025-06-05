import { useEffect, useCallback, useState } from 'react';
import { usePermissions, useAuthProvider } from 'react-admin';
import { defaultToArray } from '../utils';
import { CLASS_AGENT, GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT, AUTHENTICATED_AGENT } from '../constants';

const useAgents = (uri: any) => {
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

    const appendPermission = (agentId: any, predicate: any, mode: any) => {
      if (result[agentId]) {
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        result[agentId].permissions.push(mode);
      } else {
        result[agentId] = {
          id: agentId,
          predicate,
          // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
          permissions: [mode]
        };
      }
    };

    if (permissions) {
      for (const p of permissions) {
        if (p[CLASS_AGENT]) {
          defaultToArray(p[CLASS_AGENT])?.forEach(agentId => appendPermission(agentId, CLASS_AGENT, p['acl:mode']));
        }
        if (p[USER_AGENT]) {
          defaultToArray(p[USER_AGENT])?.forEach(userUri => appendPermission(userUri, USER_AGENT, p['acl:mode']));
        }
        if (p[GROUP_AGENT]) {
          defaultToArray(p[GROUP_AGENT])?.forEach(groupUri => appendPermission(groupUri, GROUP_AGENT, p['acl:mode']));
        }
      }
      setAgents(result);
    }
  }, [permissions]);

  const addPermission = useCallback(
    (agentId: any, predicate: any, mode: any) => {
      const prevAgents = { ...agents };
      setAgents({
        ...agents,
        [agentId]: {
          id: agentId,
          predicate,
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          permissions: agents[agentId] ? [...agents[agentId]?.permissions, mode] : [mode]
        }
      });
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      authProvider.addPermission(uri, agentId, predicate, mode).catch((e: any) => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
  );

  const removePermission = useCallback(
    (agentId: any, predicate: any, mode: any) => {
      const prevAgents = { ...agents };
      setAgents(
        Object.fromEntries(
          Object.entries(agents)
            .map(([key, agent]) => {
              // @ts-expect-error TS(2571): Object is of type 'unknown'.
              if (agent.id === agentId) {
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                agent.permissions = agent.permissions.filter((m: any) => m !== mode);
              }
              return [key, agent];
            })
            // Remove agents if they have no permissions (except if they are class agents)
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            .filter(([_, agent]) => agent.predicate === CLASS_AGENT || agent.permissions.length > 0)
        )
      );
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      authProvider.removePermission(uri, agentId, predicate, mode).catch((e: any) => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
  );

  return { agents, addPermission, removePermission };
};

export default useAgents;
