import React from 'react';
import { Edit, TabbedForm, FormTab, TextInput, AutocompleteArrayInput, NumberInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { copyValues, DateTimeInput } from '@semapps/react-admin';
import { UriArrayInput } from '@semapps/semantic-data-provider';
import ActionTitle from './ActionTitle';

const decorators = [copyValues({ name: 'pair:label', content: 'pair:description', url: 'pair:homePage' })];

export const ActionEdit = props => (
  <Edit title={<ActionTitle />} {...props}>
    <TabbedForm decorators={decorators}>
      <FormTab label="Général">
        <TextInput source="name" label="Nom" fullWidth />
        <MarkdownInput multiline source="content" label="Description" fullWidth />
        <TextInput source="url" label="Site web" fullWidth />
        <TextInput source="image" label="Image" fullWidth />
        <DateTimeInput source="published" label="Publié le" fullWidth />
        <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
      </FormTab>
      <FormTab label="Liens">
        <UriArrayInput label="Tags" reference="Tag" source="tag">
          <AutocompleteArrayInput
            optionText={record => (record ? record['pair:preferedLabel'] || record['semapps:label'] : 'Test')}
            fullWidth
          />
        </UriArrayInput>
        <UriArrayInput label="Soutenu par" reference="Actor" source="pair:involves">
          <AutocompleteArrayInput optionText={record => record.name} fullWidth />
        </UriArrayInput>
      </FormTab>
      <FormTab label="Localisation">
        <TextInput source="location.name" label="Nom" fullWidth />
        <NumberInput source="location.latitude" label="Latitude" fullWidth />
        <NumberInput source="location.longitude" label="Longitude" fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ActionEdit;
