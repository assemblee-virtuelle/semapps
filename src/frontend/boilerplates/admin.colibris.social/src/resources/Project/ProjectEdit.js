import React from 'react';
import { Edit, TabbedForm, FormTab, TextInput, AutocompleteArrayInput, NumberInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { DateTimeInput } from '@semapps/react-admin';
import { UriArrayInput } from '@semapps/semantic-data-provider';

const ProjectTitle = ({ record }) => {
  return <span>Projet {record ? `"${record['pair:label']}"` : ''}</span>;
};

const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
    <TabbedForm>
      <FormTab label="Général">
        <TextInput source="pair:label" label="Nom" fullWidth />
        <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
        <TextInput source="pair:aboutPage" label="Site web" fullWidth />
        <TextInput source="image.url" label="Image" fullWidth />
        <DateTimeInput source="published" label="Publié le" fullWidth />
        <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
      </FormTab>
      <FormTab label="Liens">
        <UriArrayInput label="Tags" reference="Tag" source="pair:interestOf">
          <AutocompleteArrayInput
            optionText={record => (record ? record['pair:preferedLabel'] || record['semapps:label'] : 'Test')}
            fullWidth
          />
        </UriArrayInput>
        <UriArrayInput label="Soutenu par" reference="Actor" source="pair:involves">
          <AutocompleteArrayInput optionText={record => record.name} fullWidth />
        </UriArrayInput>
        <UriArrayInput label="Offre" reference="HostingService" source="pair:offers">
          <AutocompleteArrayInput optionText={record => record['pair:label']} fullWidth />
        </UriArrayInput>
      </FormTab>
      <FormTab label="Localisation">
        <TextInput source="location[schema:address][schema:streetAddress]" label="Adresse" fullWidth />
        <NumberInput source="location[schema:address][schema:postalCode]" label="Code postal" fullWidth />
        <TextInput source="location[schema:address][schema:addressLocality]" label="Ville" fullWidth />
        <TextInput source="location[schema:address][schema:addressRegion]" label="Région" fullWidth />
        <TextInput source="location[schema:address][schema:addressCountry]" label="Code pays" fullWidth />
        <NumberInput source="location.latitude" label="Latitude" fullWidth />
        <NumberInput source="location.longitude" label="Longitude" fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ProjectEdit;
