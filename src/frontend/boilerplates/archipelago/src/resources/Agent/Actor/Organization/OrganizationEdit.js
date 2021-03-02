import React from 'react';
import { SimpleForm, TextInput, ImageInput, AutocompleteInput, ReferenceInput, SelectInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField, ReificationArrayInput } from '@semapps/semantic-data-provider';
import {
  UsersInput,
  OrganizationsInput,
  EventsInput,
  ThemesInput,
  DocumentsInput,
  PairLocationInput
} from '../../../../pair';
import OrganizationTitle from './OrganizationTitle';

export const OrganizationEdit = props => {
  return (
    <Edit title={<OrganizationTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="pair:label" fullWidth />
        <ReificationArrayInput
          label="Membres avec Role"
          source="pair:organizationOfMembership"
          reificationClass="pair:MembershipAssociation"
        >
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
        </ReificationArrayInput>
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
};

export default OrganizationEdit;
