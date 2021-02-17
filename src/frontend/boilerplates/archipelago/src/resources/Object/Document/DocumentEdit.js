import React from 'react';
import { SelectInput, SimpleForm, TextInput, useDataProvider } from 'react-admin';
import { MarkdownInput } from '@semapps/markdown-components';
import { Edit, ReferenceQuickCreateInput } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => {
  const dataProvider = useDataProvider();

  const loadSuggestions = async keyword => {
    if (keyword) {
      const results = await dataProvider.getList('Document', {
        pagination: {
          page: 1,
          perPage: 5
        },
        filter: { q: keyword }
      });
      if (results.total > 0) {
        return results.data.map(record => ({
          preview: record['pair:label'],
          value: `[${record['pair:label']}](#/Document/${encodeURIComponent(record.id)}/show)`
        }));
      } else {
        return [{ preview: 'Aucun résultat', value: '[' + keyword }];
      }
    }
    return [{ preview: 'Type to search documents', value: '[' + keyword }];
  };

  return (
    <Edit title={<DocumentTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="pair:label" fullWidth />
        <MarkdownInput
          multiline
          source="pair:description"
          fullWidth
          suggestionTriggerCharacters="["
          loadSuggestions={loadSuggestions}
        />
        <ReferenceQuickCreateInput reference="Folder" source="pair:containedIn">
          <SelectInput optionText="pair:label" />
        </ReferenceQuickCreateInput>
        <AgentsInput source="pair:documents" />
      </SimpleForm>
    </Edit>
  );
};

export default DocumentEdit;
