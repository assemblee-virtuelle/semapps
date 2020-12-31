import React from 'react';
import { ChipField, SingleFieldList, TextField, UrlField, DateField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField, GridList, UserIcon } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import EventTitle from './EventTitle';

const EventShow = props => (
  <Show title={<EventTitle />} {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero>
          <TextField source="pair:comment" />
          <DateField source="pair:startDate" showTime />
          <DateField source="pair:endDate" showTime />
          <UrlField source="pair:aboutPage" />
        </Hero>
        <MarkdownField source="pair:description" />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField
          label="Organisations"
          reference="Organization"
          filter={{ '@type': 'pair:Organization' }}
          source="pair:involves"
        >
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Personnes" reference="User" filter={{ '@type': 'pair:Person' }} source="pair:involves">
          <GridList xs={6} linkType="show">
            <UserIcon />
          </GridList>
        </UriArrayField>
        <UriArrayField reference="Theme" source="pair:hasTopic">
          <SingleFieldList linkType={false}>
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
