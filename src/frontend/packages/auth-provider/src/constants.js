export const ACL_READ = 'acl:Read';
export const ACL_APPEND = 'acl:Append';
export const ACL_WRITE = 'acl:Write';
export const ACL_CONTROL = 'acl:Control';

export const USER_AGENT = 'acl:agent';
export const GROUP_AGENT = 'acl:agentGroup';
export const CLASS_AGENT = 'acl:agentClass';

export const ANONYMOUS_AGENT = 'foaf:Agent';
export const AUTHENTICATED_AGENT = 'acl:AuthenticatedAgent';

export const rightsToShow = [ACL_READ, ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToList = [ACL_READ, ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToCreate = [ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToEdit = [ACL_APPEND, ACL_WRITE, ACL_CONTROL];
export const rightsToDelete = [ACL_WRITE, ACL_CONTROL];
export const rightsToControl = [ACL_CONTROL];

export const rights = {
  show: rightsToShow,
  list: rightsToList,
  create: rightsToCreate,
  edit: rightsToEdit,
  delete: rightsToDelete,
  control: rightsToControl
};

export const forbiddenErrors = {
  show: 'auth.message.resource_show_forbidden',
  edit: 'auth.message.resource_edit_forbidden',
  delete: 'auth.message.resource_delete_forbidden',
  control: 'auth.message.resource_control_forbidden',
  list: 'auth.message.container_list_forbidden',
  create: 'auth.message.container_create_forbidden',
};

export const resourceRightsLabels = {
  [ACL_READ]: 'auth.right.resource.read',
  [ACL_APPEND]: 'auth.right.resource.append',
  [ACL_WRITE]: 'auth.right.resource.write',
  [ACL_CONTROL]: 'auth.right.resource.control'
};

export const containerRightsLabels = {
  [ACL_READ]: 'auth.right.container.read',
  [ACL_WRITE]: 'auth.right.container.write',
  [ACL_CONTROL]: 'auth.right.container.control'
};
