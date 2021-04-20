import React from 'react';
import { ImageInput, SelectInput, TextInput, TabbedForm, FormTab } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ActorsInput, DocumentsInput, ThemesInput, ResourcesInput } from '../../../../pair';
import ProjectTitle from './ProjectTitle';
import { ImageField, ReferenceInput } from '@semapps/semantic-data-provider';

const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
        <TextInput source="pair:comment" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:ProjectStatus' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <TextInput source="pair:homePage" fullWidth />
        <ImageInput source="image" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
      </FormTab>
      <FormTab label="RELATIONS">
        <ActorsInput source="pair:involves" />
        <ResourcesInput source="pair:needs" />
        <DocumentsInput source="pair:documentedBy" />
        <ThemesInput source="pair:hasTopic" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ProjectEdit;
