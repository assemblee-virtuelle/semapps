import React from 'react';
import { FormTab, TextInput, SelectInput, TabbedForm } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import frLocale from 'date-fns/locale/fr';
import { Edit } from '@semapps/archipelago-layout';
import {
  ActorsInput,
  ThemesInput,
  AgentsInput,
  TasksInput,
  SkillsInput,
  DocumentsInput,
  ActivitiesInput
} from '../../../../pair';
import { ReferenceInput } from '@semapps/semantic-data-provider';
import TaskTitle from './TaskTitle';
import { DateTimeInput } from '@semapps/date-components';

const TaskEdit = props => (
  <Edit title={<TaskTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:TaskStatus' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:TaskType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <DateTimeInput
          source="pair:dueDate"
          options={{
            format: 'dd/MM/yyyy à HH:mm',
            ampm: false
          }}
          providerOptions={{
            locale: frLocale
          }}
          fullWidth
        />
        <DateTimeInput
          source="pair:endDate"
          options={{
            format: 'dd/MM/yyyy à HH:mm',
            ampm: false
          }}
          providerOptions={{
            locale: frLocale
          }}
          fullWidth
        />
      </FormTab>
      <FormTab label="Relations">
        <ActorsInput source="pair:assignedTo" />
        <ActivitiesInput source="pair:partOf" />
        <ActorsInput source="pair:hasFollower" />
        <ActorsInput source="pair:involves" />
        <TasksInput source="pair:inspiredBy" />
        <ThemesInput source="pair:hasTopic" />
        <SkillsInput source="pair:needs" />
        <DocumentsInput source="pair:uses" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default TaskEdit;
