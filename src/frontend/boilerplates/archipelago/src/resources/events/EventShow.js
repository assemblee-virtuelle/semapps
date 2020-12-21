import React from 'react';
import { ChipField, SingleFieldList, TextField, UrlField, DateField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField, GridList, UserIcon } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';

const EventTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const EventShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<EventTitle />}>
          <TextField label="Courte description" source="pair:comment" />
          <DateField label="Date de début" source="pair:startDate" showTime />
          <DateField label="Date de fin" source="pair:endDate" showTime />
          <UrlField label="Site web" source="pair:aboutPage" />
        </Hero>
        <MarkdownField source="pair:description" addLabel />
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
        <UriArrayField label="Thèmes" reference="Theme" source="pair:hasTopic">
          <SingleFieldList linkType={false}>
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
