import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { SideList, GridList, AvatarField } from '@semapps/archipelago-layout';
import { ReferenceArrayField } from '@semapps/semantic-data-provider';
import { ShowWithPermissions } from '@semapps/auth-provider';
import SkillTitle from './SkillTitle';
import { ChipField, SingleFieldList } from 'react-admin';

const SkillShow = props => (
  <ShowWithPermissions title={<SkillTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <ReferenceArrayField reference="Person" source="pair:offeredBy">
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image" />
            </GridList>
          </ReferenceArrayField>
          <ReferenceArrayField reference="Agent" source="pair:neededBy">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
          </ReferenceArrayField>
        </SideList>
      </Grid>
    </Grid>
  </ShowWithPermissions>
);

export default SkillShow;
