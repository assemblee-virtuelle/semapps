import React from 'react';
import { ChipField, SingleFieldList, TextField, DateField } from 'react-admin';
import { Grid } from '@material-ui/core';
import {
  Hero,
  Show,
  MarkdownField,
  GridList,
  MainList,
  SideList,
  AvatarField,
  SeparatedListField
} from '@semapps/archipelago-layout';
import { ReferenceArrayField } from '@semapps/semantic-data-provider';
import TaskTitle from './TaskTitle';

const TaskShow = props => (
  <Show title={<TaskTitle />} {...props}>
    <Grid container spacing={5}>

      <Grid item xs={12} sm={9}>
        <Hero>
          <DateField source="pair:dueDate" showTime />
          <DateField source="pair:endDate" showTime />

          <ReferenceArrayField reference="Project" source="pair:partOf">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </ReferenceArrayField>

          <ReferenceArrayField reference="Theme" source="pair:hasTopic">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </ReferenceArrayField>

          <ReferenceArrayField reference="Document" source="pair:uses">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </ReferenceArrayField>

          <ReferenceArrayField reference="Status" source="pair:hasStatus">
            <SeparatedListField linkType={false}>
              <TextField source="pair:label" />
            </SeparatedListField>
          </ReferenceArrayField>

          <ReferenceArrayField reference="Type" source="pair:hasType">
            <SeparatedListField linkType={false}>
              <TextField source="pair:label" />
            </SeparatedListField>
          </ReferenceArrayField>

        </Hero>

        <MainList>
          <MarkdownField source="pair:description" />
        </MainList>
      </Grid>

      <Grid item xs={12} sm={3}>
        <SideList>
          <ReferenceArrayField reference="Actor" source="pair:assignedTo" sort={{ field: 'type', order: 'ASC' }}>
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image" />
            </GridList>
          </ReferenceArrayField>
          <ReferenceArrayField reference="Actor" source="pair:hasFollower" sort={{ field: 'type', order: 'ASC' }}>
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image" />
            </GridList>
          </ReferenceArrayField>
          <ReferenceArrayField reference="Actor" source="pair:involves" sort={{ field: 'type', order: 'ASC' }}>
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image" />
            </GridList>
          </ReferenceArrayField>
        </SideList>
      </Grid>

    </Grid>
  </Show>
);

export default TaskShow;
