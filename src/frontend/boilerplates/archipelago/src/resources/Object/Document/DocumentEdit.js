import React from 'react';
import { SelectInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => (
  <EditWithPermissions title={<DocumentTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:DocumentType' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <AgentsInput source="pair:documents" />
    </SimpleForm>
  </EditWithPermissions>
);

export default DocumentEdit;
