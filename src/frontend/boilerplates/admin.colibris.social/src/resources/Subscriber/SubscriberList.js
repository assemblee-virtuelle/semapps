import React from 'react';
import { List, Datagrid, TextField, DateField, SelectField, SingleFieldList, ChipField } from 'react-admin';
import { UriArrayField } from '@semapps/semantic-data-provider';

const SubscriberList = props => (
  <List title="Abonnés Mailer" perPage={25} {...props}>
    <Datagrid>
      <TextField source="pair:e-mail" label="Adresse e-mail" />
      <TextField source="location.name" label="Localisation" />
      <SelectField
        source="location.radius"
        choices={[
          { id: '100000.0', name: '100km' },
          { id: '50000.0', name: '50km' },
          { id: '25000.0', name: '25km' }
        ]}
        label="Distance"
      />
      <DateField source="published" label="Inscription" />
      <UriArrayField reference="Theme" source="pair:hasInterest" label="Intérêts">
        <SingleFieldList>
          <ChipField source="pair:preferedLabel" />
        </SingleFieldList>
      </UriArrayField>
      <SelectField
        source="semapps:mailFrequency"
        choices={[
          { id: 'weekly', name: 'Semaine' },
          { id: 'daily', name: 'Jour' }
        ]}
        label="Fréquence désirée"
      />
    </Datagrid>
  </List>
);

export default SubscriberList;
