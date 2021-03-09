import React from 'react';
import { SelectInput, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput, useLoadLinks } from '@semapps/markdown-components';
import { Edit } from '@semapps/archipelago-layout';
import { ReferenceInput } from '@semapps/semantic-data-provider';
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
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:DocumentType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <AgentsInput source="pair:documents" />
      </SimpleForm>
    </Edit>
  );
};

export default DocumentEdit;
