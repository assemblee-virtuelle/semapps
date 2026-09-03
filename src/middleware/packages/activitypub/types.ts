import { WacPermissionFunction, WacPermissionObject } from '@semapps/webacl';

interface CollectionControlledActions {
  post: string;
}

export interface CollectionRegistration {
  path?: string;
  summary?: string;
  attachToTypes: string[];
  attachPredicate: string;
  ordered: boolean;
  itemsPerPage: number;
  dereferenceItems: boolean;
  sortPredicate: string;
  sortOrder: 'semapps:DescOrder' | 'semapps:AscOrder';
  permissions: WacPermissionFunction | WacPermissionObject;
  controlledActions: CollectionControlledActions;
}
