export const LexiconAutocompleteInput: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export function LexiconCreateDialog({
  fetchLexicon,
  selectData
}: {
  fetchLexicon: any;
  selectData: any;
}): import('react/jsx-runtime').JSX.Element;
export function useFork(resourceId: any): (remoteRecordUri: any, stripProperties?: any[]) => Promise<void>;
export function useSync(resourceId: any): (remoteRecordUri: any) => Promise<void>;
export function ImportForm({ stripProperties }: { stripProperties: any }): import('react/jsx-runtime').JSX.Element;
export function CreateOrImportForm({
  stripProperties,
  ...rest
}: {
  [x: string]: any;
  stripProperties: any;
}): import('react/jsx-runtime').JSX.Element;
export function LexiconImportForm({
  fetchLexicon,
  selectData
}: {
  fetchLexicon: any;
  selectData: any;
}): import('react/jsx-runtime').JSX.Element;
export function fetchWikidata(apiUrl?: string): ({ keyword, locale }: { keyword: any; locale: any }) => Promise<any>;
export function fetchESCO(
  apiUrl?: string,
  type?: string
): ({ keyword, locale }: { keyword: any; locale: any }) => Promise<any>;

//# sourceMappingURL=index.d.ts.map
