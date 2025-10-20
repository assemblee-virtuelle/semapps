interface ControlledActions {
  post: string;
  list: string;
  get: string;
  getHeaderLinks: string;
  create: string;
  patch: string;
  put: string;
  delete: string;
}

export interface WacPermission {
  uri?: string; // For users and groups
  read: boolean;
  write: boolean;
  append: boolean;
  control: boolean;
}

export interface WacPermissionObject {
  anon?: WacPermission;
  anyUser?: WacPermission;
  user?: WacPermission;
  group?: WacPermission;
}

export type WacPermissionFunction = (webId: string) => WacPermissionObject;

export interface ContainerOptions {
  path?: string;
  name?: string;
  accept?: string; // Check if this is still used
  acceptedTypes?: string | string[];
  shapeTreeUri?: string;
  readOnly?: boolean;
  activateTombstones?: boolean;
  excludeFromMirror?: boolean;
  permissions?: WacPermissionFunction | WacPermissionObject;
  newResourcesPermissions?: WacPermissionFunction | WacPermissionObject;
  controlledActions?: ControlledActions;
  typeIndex?: 'private' | 'public';
}
