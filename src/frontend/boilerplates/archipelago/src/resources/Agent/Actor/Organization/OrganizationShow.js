import React from 'react';
import { TextField, UrlField, ChipField, SingleFieldList } from 'react-admin';
import { Grid } from '@material-ui/core';
import { MainList, SideList, Hero, UserIcon, GridList, Show, MarkdownField } from '@semapps/archipelago-layout';
import { MapField } from '@semapps/geo-components';
import { UriArrayField } from '@semapps/semantic-data-provider';
import OrganizationTitle from './OrganizationTitle';

const OrganizationShow = props => (
  <Show title={<OrganizationTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
          <UrlField source="pair:homePage" />
        </Hero>
        <MainList>
          <MarkdownField source="pair:description" />
          <MapField
            source="pair:hasLocation"
            address={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:label']}
            latitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:latitude']}
            longitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:longitude']}
          />
        </MainList>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <UriArrayField reference="Person" source="pair:affiliates">
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
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default OrganizationShow;
