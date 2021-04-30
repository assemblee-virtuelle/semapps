import React from 'react';
import { SimpleForm, TextInput, SelectInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ActorsInput, ActivitiesInput } from '../../../../pair';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import IdeaTitle from './IdeaTitle';

const IdeaEdit = props => (
  <Edit title={<IdeaTitle />} {...props}>
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
  </Edit>
);

export default IdeaEdit;
