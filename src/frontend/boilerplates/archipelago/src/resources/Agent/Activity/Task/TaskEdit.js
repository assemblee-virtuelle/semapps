import React from 'react';
import { SimpleForm, TextInput, SelectInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ActorsInput, ActivitiesInput } from '../../../../pair';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import TaskTitle from './TaskTitle';

const TaskEdit = props => (
  <EditWithPermissions title={<TaskTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:TaskStatus' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:TaskType' }}>
        <SelectInput optionText="pair:label" />
      </ReferenceInput>
      <ActorsInput source="pair:assignedTo" />
      <ActivitiesInput source="pair:partOf" />
    </SimpleForm>
  </EditWithPermissions>
);

export default TaskEdit;
