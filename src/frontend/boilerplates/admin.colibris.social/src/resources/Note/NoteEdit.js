import React from 'react';
import { Edit, SimpleForm, TextInput, AutocompleteArrayInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { DateTimeInput } from '@semapps/react-admin';
import { UriArrayInput } from '@semapps/semantic-data-provider';

const NoteTitle = ({ record }) => {
  return <span>Actualité {record ? `"${record.name}"` : ''}</span>;
};

const NoteEdit = props => (
  <Edit title={<NoteTitle />} {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nom" fullWidth />
      <MarkdownInput source="content" label="Description" fullWidth />
      <UriArrayInput label="Auteur" reference="Project" source="attributedTo">
        <AutocompleteArrayInput optionText={record => (record ? record['pair:label'] : 'Label manquant')} fullWidth />
      </UriArrayInput>
      <TextInput source="image" label="Image" fullWidth />
      <DateTimeInput source="published" label="Publié le" fullWidth />
      <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
    </SimpleForm>
  </Edit>
);

export default NoteEdit;
