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
        <TextInput source="pair:comment" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <TextInput source="pair:homePage" fullWidth />
        <ImageInput source="image" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
        <ReificationArrayInput source="pair:organizationOfMembership" reificationClass="pair:MembershipAssociation">
          <ReferenceInput reference="Person" source="pair:membershipActor">
            <AutocompleteInput
              optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
              shouldRenderSuggestions={value => value && value.length > 1}
            />
          </ReferenceInput>
          <ReferenceInput reference="MembershipRole" source="pair:membershipRole">
            <SelectInput optionText="pair:label" />
          </ReferenceInput>
        </ReificationArrayInput>
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
