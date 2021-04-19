import React from 'react';
import PublicIcon from '@material-ui/icons/Public';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';

export const ACL_READ = 'acl:Read';
export const ACL_APPEND = 'acl:Append';
export const ACL_WRITE = 'acl:Write';
export const ACL_CONTROL = 'acl:Control';

export const rightsToList = [ACL_READ, ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToCreate = [ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToEdit = [ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToDelete = [ACL_WRITE, ACL_CONTROL];
export const rightsToControl = [ACL_CONTROL];

export const rightsLabel = {
  [ACL_READ]: 'Lire',
  [ACL_APPEND]: 'Enrichir',
  [ACL_WRITE]: 'Modifier',
  [ACL_CONTROL]: 'Administrer'
};

export const agentsClasses = {
  anon: 'acl:agentClass',
  anyUser: 'acl:agentClass',
  user: 'acl:agent',
  group: 'acl:group'
};

export const agentsDefinitions = {
  anon: {
    label: 'Tous les utilisateurs',
    icon: <PublicIcon />
  },
  anyUser: {
    label: 'Utilisateurs connectés',
    icon: <VpnLockIcon />
  },
  user: {
    icon: <PersonIcon />
  },
  group: {
    icon: <GroupIcon />
  }
};
