import React from 'react';
import { SimpleForm, TextInput, SelectInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { MarkdownInput } from '@semapps/markdown-components';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import { ActorsInput, ActivitiesInput } from '../../pair';
import IdeaTitle from './IdeaTitle';

const IdeaEdit = props => (
  <EditWithPermissions title={<IdeaTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:IdeaStatus' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:IdeaType' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <ActorsInput source="pair:brainstormedBy" />
      <ActivitiesInput source="pair:concretizedBy" />
    </SimpleForm>
  </EditWithPermissions>
);

export default IdeaEdit;
