declare module '@semapps/activitypub-components' {
  export function parseJsonLd(jsonLdObj: object): Promise<any>;
  export function getShaclValidator(shapeUri: string): Promise<{ success: boolean; validator?: any; error?: Error }>;
}
