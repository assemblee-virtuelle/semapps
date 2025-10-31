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
  read: boolean;
  write: boolean;
  append: boolean;
  control: boolean;
}

export interface WacPermissionObject {
  anon?: WacPermission;
  anyUser?: WacPermission;
  user?: { uri: string } & WacPermission;
  group?: { uri: string } & WacPermission;
}

export type WacPermissionFunction = (webId: string) => WacPermissionObject;

export interface Registration {
  name: string;
  isContainer: boolean;
  path?: string;
  types?: string | string[];
  shapeTreeUri?: string;
  activateTombstones?: boolean;
  excludeFromMirror?: boolean;
  permissions?: WacPermissionFunction | WacPermissionObject;
  newResourcesPermissions?: WacPermissionFunction | WacPermissionObject;
  controlledActions: ControlledActions;
  typeIndex: 'private' | 'public';
}

export interface LdpRegistryServiceSettings {
  baseUrl?: string;
  containers: Registration[];
  defaultOptions: Partial<Registration>;
  allowSlugs: boolean;
}
