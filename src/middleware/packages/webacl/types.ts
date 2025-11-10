import { Context } from 'moleculer';

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
  default?: {
    anon?: WacPermission;
    anyUser?: WacPermission;
    user?: { uri: string } & WacPermission;
    group?: { uri: string } & WacPermission;
  };
}

export type WacPermissionFunction = (webId: string, ctx?: Context) => WacPermissionObject;
