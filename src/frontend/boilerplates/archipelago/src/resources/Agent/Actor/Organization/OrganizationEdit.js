import React from 'react';
import { SimpleForm, TextInput, ImageInput } from 'react-admin';
import { MarkdownInput } from '@semapps/markdown-components';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import {
  UsersInput,
  OrganizationsInput,
  EventsInput,
  ThemesInput,
  DocumentsInput,
  PairLocationInput
} from '../../../../pair';
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
      <PairLocationInput source="pair:hasLocation" fullWidth />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
