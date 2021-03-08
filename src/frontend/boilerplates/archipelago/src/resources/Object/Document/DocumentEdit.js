import React from 'react';
import { SelectInput, SimpleForm, TextInput, ReferenceInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => (
  <Edit title={<DocumentTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:DocumentType' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <AgentsInput source="pair:documents" />
    </SimpleForm>
  </Edit>
);

export default DocumentEdit;
