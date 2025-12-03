import { Readable } from 'stream';
import { WacPermissionObject, WacPermissionFunction } from '@semapps/webacl';

export interface ControlledActions {
  post: string;
  list: string;
  get: string;
  create: string;
  patch: string;
  put: string;
  delete: string;
  getHeaderLinks: string;
  postOnResource: string;
}

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

export interface Binary {
  file: Buffer;
  mimeType: string;
  size: number;
  time?: Date;
}

export interface BinaryAdapterInterface {
  name: string;
  storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string>;
  isBinary(uri: string): Promise<boolean>;
  getBinary(uri: string): Promise<Binary>;
  deleteBinary(uri: string): Promise<void>;
}
