import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { SideList, Show, GridList, AvatarField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import SkillTitle from './SkillTitle';

const SkillShow = props => (
  <Show title={<SkillTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <UriArrayField reference="Person" source="pair:offeredBy">
            <GridList xs={6} linkType="show">
              <AvatarField label={record => `${record['pair:firstName']} ${record['pair:lastName']}`} image="image" />
            </GridList>
          </UriArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default SkillShow;
