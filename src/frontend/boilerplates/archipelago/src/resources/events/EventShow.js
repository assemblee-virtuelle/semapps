import React from 'react';
import { ChipField, SingleFieldList, TextField, UrlField, DateField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';

const ProjectTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const EventShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<ProjectTitle />}>
          <TextField label="Courte description" source="pair:comment" />
          <DateField label="Date de début" source="pair:startDate" showTime />
          <DateField label="Date de fin" source="pair:endDate" showTime />
          <UrlField label="Site web" source="pair:homePage" />
          <UrlField label="Site web" source="pair:aboutPage" />
        </Hero>
        <MarkdownField source="pair:description" addLabel />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField label="Proposé par" reference="Organization" source="pair:deliveredBy">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Intérêts" reference="Interest" source="pair:hasInterest">
          <SingleFieldList linkType={false}>
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
