// This file can be removed once semantic-data-provider package will be fully converted to Typescript
// Typings here are not exhaustive. Only exported elements required by other packages are reported here
declare module '@semapps/semantic-data-provider' {
  type DataServerId = string;

  const useContainers: (resource: string) => Record<DataServerId, string[]>;

  export const useContainers;
}
