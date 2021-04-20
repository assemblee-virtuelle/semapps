import React from 'react';
import { FormTab, SelectInput, TabbedForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import { AgentsInput } from '../../../pair';
import DocumentTitle from './DocumentTitle';

export const DocumentEdit = props => (
  <Edit title={<DocumentTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="données">
        <TextInput source="pair:label" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:DocumentType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
      </FormTab>
      <FormTab label="relations">
        <AgentsInput source="pair:documents" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default DocumentEdit;
