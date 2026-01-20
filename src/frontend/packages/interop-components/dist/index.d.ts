import React from "react";
import { JSX } from "react/jsx-runtime";
export const LexiconAutocompleteInput: React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
export const LexiconCreateDialog: ({ fetchLexicon, selectData }: any) => JSX.Element;
export const useFork: (resourceId: any) => (remoteRecordUri: any, stripProperties?: never[]) => Promise<void>;
export const useSync: (resourceId: any) => (remoteRecordUri: any) => Promise<void>;
export const ImportForm: ({ stripProperties }: any) => JSX.Element;
export const CreateOrImportForm: ({ stripProperties, ...rest }: any) => JSX.Element;
export const LexiconImportForm: ({ fetchLexicon, selectData }: any) => JSX.Element;
export const fetchWikidata: (apiUrl?: string) => ({ keyword, locale }: any) => Promise<any>;
export const fetchESCO: (apiUrl?: string, type?: string) => ({ keyword, locale }: any) => Promise<any>;

//# sourceMappingURL=index.d.ts.map
