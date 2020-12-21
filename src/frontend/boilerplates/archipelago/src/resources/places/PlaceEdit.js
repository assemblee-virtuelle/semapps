import React from 'react';
import { AutocompleteArrayInput, AutocompleteInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput } from '@semapps/semantic-data-provider';
import { PlacesInput } from "../../inputs";

export const PlaceEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Titre" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <UriArrayInput label="Sujets" reference="Subject" source="pair:hosts">
        <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
      </UriArrayInput>
      <ReferenceInput label="Fait partie de" reference="Place" source="pair:partOf" fullWidth>
        <AutocompleteInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
      </ReferenceInput>
      <PlacesInput label="Parties" source="pair:hasPart" />
    </SimpleForm>
  </Edit>
);

export default PlaceEdit;
