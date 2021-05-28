import React from 'react';
import {
  TextInput,
  ImageInput,
  AutocompleteInput,
  SelectInput,
  TabbedForm,
  FormTab,
  ArrayInput,
  SimpleFormIterator
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ImageField, ReferenceInput, ReificationArrayInput } from '@semapps/semantic-data-provider';
import { OrganizationsInput, EventsInput, ThemesInput, DocumentsInput, PairLocationInput } from '../../../../pair';
import OrganizationTitle from './OrganizationTitle';

export const OrganizationEdit = props => {
  return (
    <EditWithPermissions title={<OrganizationTitle />} {...props}>
      <TabbedForm redirect="show">
        <FormTab label="Données">
          <TextInput source="pair:label" fullWidth />
          <TextInput source="pair:comment" fullWidth />
          <MarkdownInput multiline source="pair:description" fullWidth />
          <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:AgentStatus' }}>
            <SelectInput optionText="pair:label" />
          </ReferenceInput>
          <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:OrganizationType' }}>
            <SelectInput optionText="pair:label" />
          </ReferenceInput>
          <ArrayInput source="pair:homePage">
            <SimpleFormIterator>
              <TextInput label="" fullWidth />
            </SimpleFormIterator>
          </ArrayInput>
          <PairLocationInput source="pair:hasLocation" fullWidth />
          <ImageInput source="image" accept="image/*">
            <ImageField source="src" />
          </ImageInput>
        </FormTab>
        <FormTab label="Membres">
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
        </FormTab>
        <FormTab label="Relations">
          <OrganizationsInput source="pair:partnerOf" />
          <EventsInput source="pair:involvedIn" />
          <ThemesInput source="pair:hasTopic" />
          <DocumentsInput source="pair:documentedBy" />
        </FormTab>
      </TabbedForm>
    </EditWithPermissions>
  );
};

export default OrganizationEdit;
