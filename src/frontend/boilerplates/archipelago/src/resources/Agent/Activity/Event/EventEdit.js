import React from 'react';
import { SimpleForm, TextInput, DateTimeInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ActorsInput, ThemesInput } from '../../../../inputs';
import EventTitle from './EventTitle';

const EventEdit = props => (
  <Edit title={<EventTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:aboutPage" fullWidth />
      <DateTimeInput source="pair:startDate" fullWidth />
      <DateTimeInput source="pair:endDate" fullWidth />
      <ActorsInput source="pair:involves" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default EventEdit;
