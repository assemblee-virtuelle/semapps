import React from 'react';
import { SimpleForm, TextInput, ImageInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput } from "../../inputs";

export const OrganizationEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <ImageInput source="image" label="Logo" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput label="Membres" source="pair:affiliates" />
      <OrganizationsInput label="Partenaires" source="pair:partnerOf" />
      <EventsInput label="Participe à" source="pair:involvedIn" />
      <ThemesInput label="Thèmes" source="pair:hasTopic" />
      <DocumentsInput label="Documents" source="pair:documentedBy" />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
