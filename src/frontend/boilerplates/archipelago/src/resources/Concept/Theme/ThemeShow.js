import React from 'react';
import { ChipField, SingleFieldList, TextField } from 'react-admin';
import { Grid } from '@material-ui/core';
import { MainList, SideList, Hero, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import ThemeTitle from './ThemeTitle';

const ThemeShow = props => (
  <Show title={<ThemeTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero>
          <TextField source="pair:comment" />
        </Hero>
        <MainList>
          <MarkdownField source="pair:description" />
        </MainList>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <UriArrayField
            label="Organisations"
            filter={{ type: 'pair:Organization' }}
            reference="Organization"
            source="pair:topicOf"
          >
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </UriArrayField>
          <UriArrayField label="Evénements" filter={{ type: 'pair:Event' }} reference="Event" source="pair:topicOf">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </UriArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default ThemeShow;
