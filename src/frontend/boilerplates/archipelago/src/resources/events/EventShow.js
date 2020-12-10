import React from 'react';
import { ChipField, SingleFieldList, TextField, DateField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField } from '@semapps/archipelago-layout';
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
        </Hero>
        <MarkdownField source="pair:description" addLabel />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField label="Participe" reference="Organization" source="pair:involves">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Tags" reference="Theme" source="pair:hasTopic">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
