import React from 'react';
import { ChipField, SingleFieldList, TextField, UrlField, DateField } from 'react-admin';
import { Grid } from '@material-ui/core';
import { Hero, Show, MarkdownField, GridList, MainList, SideList, AvatarField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import EventTitle from './EventTitle';

const EventShow = props => (
  <Show title={<EventTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero>
          <TextField source="pair:comment" />
          <DateField source="pair:startDate" showTime />
          <DateField source="pair:endDate" showTime />
          <UrlField source="pair:aboutPage" />
        </Hero>
        <MainList>
          <MarkdownField source="pair:description" />
        </MainList>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <UriArrayField reference="Actor" source="pair:involves" sort={{ field: 'type', order: 'ASC' }}>
            <GridList xs={6} linkType="show">
              <AvatarField
                label={record =>
                  record.type.includes('pair:Person')
                    ? `${record['pair:firstName']} ${record['pair:lastName']}`
                    : record['pair:label']
                }
                image={record => record['image']}
              />
            </GridList>
          </UriArrayField>
          <UriArrayField reference="Theme" source="pair:hasTopic">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </UriArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default EventShow;
