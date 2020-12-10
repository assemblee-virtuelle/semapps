import React from 'react';
import {AutocompleteInput, ReferenceInput, SimpleForm, TextInput} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { OrganizationsInput, EventsInput, ThemesInput, OrganizationTypesInput } from "../../inputs";

export const OrganizationEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <ReferenceInput label="Région" reference="Place" source="pair:hostedIn" fullWidth>
        <AutocompleteInput
          optionText="pair:label"
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </ReferenceInput>
      <OrganizationTypesInput label="Type d'organisation" source="pair:hasSubjectType" />
      <OrganizationsInput label="Filiales" source="pair:hasPart" />
      <OrganizationsInput label="Maison-mère" source="pair:partOf" />
      <OrganizationsInput label="Partenaires" source="pair:partnerOf" />
      <OrganizationsInput label="Connait" source="pair:follows" />
      <OrganizationsInput label="Connu par" source="pair:hasFollower" />
      <EventsInput label="Participe à" source="pair:involvedIn" />
      <ThemesInput label="Tags à" source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
