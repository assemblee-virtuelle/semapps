import React from 'react';
import { SimpleForm, TextInput, ImageInput, SelectInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField, ReferenceInput } from '@semapps/semantic-data-provider';
import {
  OrganizationsInput,
  EventsInput,
  ThemesInput,
  DocumentsInput,
  PairLocationInput,
  UsersInput
} from '../../../../pair';
import OrganizationTitle from './OrganizationTitle';

export const OrganizationEdit = props => {
  return (
    <Edit title={<OrganizationTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="pair:label" fullWidth />
        <TextInput source="pair:comment" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:OrganizationType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
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
};

export default OrganizationEdit;
