import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import frLocale from 'date-fns/locale/fr';
import { EditWithPermissions } from '@semapps/auth-provider';
import { DateTimeInput } from '@semapps/date-components';
import { ActorsInput, ThemesInput } from '../../../../pair';
import EventTitle from './EventTitle';

const EventEdit = props => (
  <EditWithPermissions title={<EventTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:aboutPage" fullWidth />
      <DateTimeInput
        source="pair:startDate"
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
      <ActorsInput source="pair:involves" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </EditWithPermissions>
);

export default EventEdit;
