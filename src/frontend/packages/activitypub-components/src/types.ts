export interface UseCollectionOptions {
  dereferenceItems?: boolean;
  liveUpdates?: boolean;
}

export interface AwaitActivityOptions {
  timeout?: number;
  checkExistingActivities?: boolean;
}

export type SolidNotification = {
  '@context': string | string[];
  id: string;
  type: 'Create' | 'Update' | 'Delete' | 'Add' | 'Remove';
  object: string;
  state?: string;
  published: string;
};
