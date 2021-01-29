import React from 'react';
import { SelectInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit, ReferenceQuickCreateInput } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../inputs';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => (
  <Edit title={<DocumentTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceQuickCreateInput reference="Folder" source="pair:containedIn">
        <SelectInput optionText="pair:label" />
      </ReferenceQuickCreateInput>
      <AgentsInput source="pair:documents" />
    </SimpleForm>
  </Edit>
);

export default DocumentEdit;
