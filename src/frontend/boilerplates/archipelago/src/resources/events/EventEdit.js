import React from 'react';
import { SimpleForm, TextInput, DateTimeInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ActorsInput, ThemesInput } from "../../inputs";

const EventEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:aboutPage" label="Site web" fullWidth />
      <DateTimeInput source="pair:startDate" label="Date de début" fullWidth />
      <DateTimeInput source="pair:endDate" label="Date de fin" fullWidth />
      <ActorsInput label="Participe" source="pair:involves" />
      <ThemesInput label="Thèmes" source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default EventEdit;
