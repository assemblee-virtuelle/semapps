import React from 'react';
import {
  SimpleForm,
  TextInput,
  ImageInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  AutocompleteInput,
  SelectInput
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField,CompositArrayInput } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput } from '../../../../inputs';
import OrganizationTitle from './OrganizationTitle';

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:homePage" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput source="pair:affiliates" />
      <CompositArrayInput label="Membres avec Role" source="pair:organizationOfMembership">
        <SimpleFormIterator>
          <ReferenceInput label="membre" reference="Person" source="pair:membershipActor">
            <AutocompleteInput optionText="pair:lastName" allowEmpty />
          </ReferenceInput>
          <ReferenceInput label="role" reference="MembershipRole" source="pair:membershipRole">
            <SelectInput
              optionText="pair:label"
              shouldRenderSuggestions={value => value && value.length > 1}
              fullWidth
            />
          </ReferenceInput>
        </SimpleFormIterator>
      </CompositArrayInput>
      <OrganizationsInput source="pair:partnerOf" />
      <EventsInput source="pair:involvedIn" />
      <ThemesInput source="pair:hasTopic" />
      <DocumentsInput source="pair:documentedBy" />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
