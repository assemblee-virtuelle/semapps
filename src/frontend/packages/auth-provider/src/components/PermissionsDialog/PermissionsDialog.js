import React, { useMemo, useCallback } from 'react';
import { Button, useAuthProvider } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';
import AddPermissionsForm from "./AddPermissionsForm";
import EditPermissionsForm from './EditPermissionsForm';
import { defaultToArray } from "../../utils";
import { agentsDefinitions } from "../../constants";
import usePermissionsWithRefetch from "../usePermissionsWithRefetch";

const useStyles = makeStyles(() => ({
  title: {
    paddingBottom: 8
  },
  actions: {
    padding: 15
  },
  addForm: {
    paddingTop: 0
  },
  listForm: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    maxHeight: 210
  }
}));

const applyToAgentClass = (p, agentClass) => Array.isArray(p['acl:agentClass']) ? p['acl:agentClass'].includes(agentClass) : p['acl:agentClass'] === agentClass;
const appendPermission = (agents, agentId, agentType, mode) => {
  if( agents[agentId] ) {
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

const PermissionsDialog = ({ open, onClose, resourceId }) => {
  const classes = useStyles();

  const { permissions, refetch } = usePermissionsWithRefetch(resourceId);
  const authProvider = useAuthProvider();

  // Format list of authorized agents, based on the permissions returned for the resource
  const agents = useMemo(() => {
    let returnValue = {};
    if( permissions ) {
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
    }
    return returnValue;
  }, [permissions]);

  const addPermission = useCallback((agentId, agentType, mode) => {
    authProvider
      .addPermission(resourceId, agentId, agentType, mode)
      .then(() => refetch());
  }, [resourceId, authProvider, refetch]);

  const removePermission = useCallback((agentId, agentType, mode) => {
    authProvider
      .removePermission(resourceId, agentId, agentType, mode)
      .then(() => refetch());
  }, [resourceId, authProvider, refetch]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>Permissions sur la ressource</DialogTitle>
      <DialogContent className={classes.addForm}>
        <AddPermissionsForm addPermission={addPermission} />
      </DialogContent>
      <DialogContent className={classes.listForm}>
        <EditPermissionsForm agents={agents} addPermission={addPermission} removePermission={removePermission} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button label="ra.action.close" variant="inlined" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default PermissionsDialog;
