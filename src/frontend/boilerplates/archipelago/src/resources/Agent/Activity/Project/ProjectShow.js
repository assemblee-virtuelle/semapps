import React from 'react';
import { ChipField, SingleFieldList, TextField, UrlField, SimpleList } from 'react-admin';
import { Grid } from '@material-ui/core';
import { SideList, MainList, Hero, AvatarField, GridList, Show, MarkdownField } from '@semapps/archipelago-layout';
import { ReferenceArrayField } from '@semapps/semantic-data-provider';
import ProjectTitle from './ProjectTitle';
import DescriptionIcon from '@material-ui/icons/Description';

const ProjectShow = props => (
  <Show title={<ProjectTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField label="Courte description" source="pair:comment" />
          <UrlField label="Site web" source="pair:homePage" />
        </Hero>
        <MainList>
          <MarkdownField source="pair:description" />
          <ReferenceArrayField reference="Document" source="pair:documentedBy">
            <SimpleList
              primaryText={record => record && record['pair:label']}
              leftIcon={() => <DescriptionIcon />}
              linkType="show"
            />
          </ReferenceArrayField>
        </MainList>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <ReferenceArrayField reference="Actor" source="pair:involves">
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image" />
            </GridList>
          </ReferenceArrayField>
          <ReferenceArrayField reference="Theme" source="pair:hasTopic">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </ReferenceArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default ProjectShow;
