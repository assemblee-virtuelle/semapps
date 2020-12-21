import React from 'react';
import { SelectInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit, ReferenceQuickCreateInput } from '@semapps/archipelago-layout';
import { SubjectsInput } from "../../inputs";

export const DocumentEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceQuickCreateInput label="Dossier" reference="Folder" source="pair:containedIn">
        <SelectInput optionText="pair:label" />
      </ReferenceQuickCreateInput>
      <SubjectsInput label="Sujet" source="pair:documents" />
    </SimpleForm>
  </Edit>
);

export default DocumentEdit;
