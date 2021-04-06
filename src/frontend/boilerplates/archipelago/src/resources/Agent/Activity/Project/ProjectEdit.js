import React from 'react';
import { ImageInput, SelectInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ActorsInput, DocumentsInput, ThemesInput, ResourcesInput } from '../../../../pair';
import ProjectTitle from './ProjectTitle';
import { ImageField, ReferenceInput } from '@semapps/semantic-data-provider';

const ProjectEdit = props => (
  <EditWithPermissions title={<ProjectTitle />} {...props}>
    <SimpleForm redirect="show">
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
      <ActorsInput source="pair:involves" />
      <ResourcesInput source="pair:needs" />
      <DocumentsInput source="pair:documentedBy" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </EditWithPermissions>
);

export default ProjectEdit;
