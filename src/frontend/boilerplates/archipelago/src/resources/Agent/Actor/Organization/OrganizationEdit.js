import React from 'react';
import { SimpleForm, TextInput, ImageInput, NumberInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput } from '../../../../inputs';
import OrganizationTitle from './OrganizationTitle';

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:homePage" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput source="pair:affiliates" />
      <OrganizationsInput source="pair:partnerOf" />
      <EventsInput source="pair:involvedIn" />
      <ThemesInput source="pair:hasTopic" />
      <DocumentsInput source="pair:documentedBy" />
      <NumberInput source="pair:address[pair:latitude]" fullWidth />
      <NumberInput source="pair:address[pair:longitude]" fullWidth />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
