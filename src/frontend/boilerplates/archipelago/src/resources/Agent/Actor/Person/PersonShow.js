import React from 'react';
import { ChipField, SingleFieldList, TextField } from 'react-admin';
import { Grid } from "@material-ui/core";
import { MainList, SideList, Hero, Show } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import { MapField } from '@semapps/geo-components';
import PersonTitle from './PersonTitle';

const PersonShow = props => (
  <Show title={<PersonTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:firstName" />
          <TextField source="pair:lastName" />
          <TextField source="pair:comment" />
        </Hero>
        <MainList>
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
          <UriArrayField reference="Organization" source="pair:affiliatedBy">
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
          <UriArrayField reference="Skill" source="pair:offers">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </UriArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default PersonShow;
