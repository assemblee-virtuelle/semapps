import React from 'react';
import { TextField, UrlField, ChipField, SingleFieldList } from 'react-admin';
import { Column, ColumnShowLayout, Hero, UserIcon, GridList, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import OrganizationTitle from './OrganizationTitle';

const OrganizationShow = props => (
  <Show title={<OrganizationTitle />} {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
          <UrlField source="pair:homePage" />
        </Hero>
        <MarkdownField source="pair:description" />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField reference="User" source="pair:affiliates">
          <GridList xs={6} linkType="show">
            <UserIcon />
          </GridList>
        </UriArrayField>
        <UriArrayField reference="Organization" source="pair:partnerOf">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField
          label="Projets"
          reference="Project"
          filter={{ '@type': 'pair:Project' }}
          source="pair:involvedIn"
        >
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Evénements" reference="Event" filter={{ '@type': 'pair:Event' }} source="pair:involvedIn">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField reference="Theme" source="pair:hasTopic">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField reference="Document" source="pair:documentedBy">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default OrganizationShow;
