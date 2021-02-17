import React from 'react';
import { SelectInput, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput, useLoadLinks } from '@semapps/markdown-components';
import { Edit, ReferenceQuickCreateInput } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => {
  const loadLinks = useLoadLinks('Document', 'id', 'pair:label');
  return (
    <Edit title={<DocumentTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="pair:label" fullWidth />
        <MarkdownInput
          multiline
          source="pair:description"
          fullWidth
          suggestionTriggerCharacters="["
          loadSuggestions={loadLinks}
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
