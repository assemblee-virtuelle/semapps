import React from 'react';
import { FormTab, SelectInput, TabbedForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import { MarkdownInput } from '@semapps/markdown-components';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => (
  <EditWithPermissions title={<DocumentTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:DocumentType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
      </FormTab>
      <FormTab label="Relations">
        <AgentsInput source="pair:documents" />
      </FormTab>
    </TabbedForm>
  </EditWithPermissions>
);

export default DocumentEdit;
