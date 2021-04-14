import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import frLocale from 'date-fns/locale/fr';
import { Edit } from '@semapps/archipelago-layout';
import { DateTimeInput } from '@semapps/date-components';
import { ActorsInput, ActivitiesInput } from '../../../../pair';
import TaskTitle from './TaskTitle';

const TaskEdit = props => (
  <Edit title={<TaskTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ActorsInput source="pair:assignedTo" />
      <ActivitiesInput source="pair:partOf" />
    </SimpleForm>
  </Edit>
);

export default TaskEdit;
