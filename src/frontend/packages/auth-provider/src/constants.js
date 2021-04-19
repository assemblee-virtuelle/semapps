export const ACL_READ = 'acl:Read';
export const ACL_APPEND = 'acl:Append';
export const ACL_WRITE = 'acl:Write';
export const ACL_CONTROL = 'acl:Control';

export const USER_AGENT = 'acl:agent';
export const GROUP_AGENT = 'acl:agentGroup';
export const CLASS_AGENT = 'acl:agentClass';

export const ANONYMOUS_AGENT = 'foaf:Agent';
export const AUTHENTICATED_AGENT = 'acl:AuthenticatedAgent';

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

export const defaultAgents = {
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
