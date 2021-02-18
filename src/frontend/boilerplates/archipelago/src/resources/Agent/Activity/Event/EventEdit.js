import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import DateFnsUtils from '@date-io/date-fns';
import frLocale from "date-fns/locale/fr";
import { Edit } from '@semapps/archipelago-layout';
import { DateTimeInput } from '@semapps/date-components';
import { ActorsInput, ThemesInput } from '../../../../pair';
import EventTitle from './EventTitle';

const EventEdit = props => (
  <Edit title={<EventTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:aboutPage" fullWidth />
      <DateTimeInput source="pair:startDate" options={{ format: 'DD/MM/YYYY', ampm: false }} providerOptions={{ dateAdapter: DateFnsUtils }} fullWidth />
      <DateTimeInput source="pair:endDate" options={{ format: 'DD/MM/YYYY' }} fullWidth />
      <ActorsInput source="pair:involves" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default EventEdit;
