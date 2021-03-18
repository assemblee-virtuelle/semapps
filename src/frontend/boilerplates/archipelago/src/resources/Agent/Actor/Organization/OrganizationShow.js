import React from 'react';
import { TextField, UrlField, ChipField, SingleFieldList, SimpleList, Datagrid } from 'react-admin';
import { Grid } from '@material-ui/core';
import {
  MainList,
  SideList,
  Hero,
  GridList,
  Show,
  MarkdownField,
  AvatarField,
  UserIcon
} from '@semapps/archipelago-layout';
import { MapField } from '@semapps/geo-components';
import { ReferenceArrayField, ReferenceField, ReifiedArrayField } from '@semapps/semantic-data-provider';
import OrganizationTitle from './OrganizationTitle';
import DescriptionIcon from '@material-ui/icons/Description';
import HomeIcon from '@material-ui/icons/Home';

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
          <ReferenceArrayField reference="Document" source="pair:documentedBy">
            <SimpleList
              primaryText={record => record && record['pair:label']}
              leftIcon={() => <DescriptionIcon />}
              linkType="show"
            />
          </ReferenceArrayField>
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
          <ReifiedArrayField
            source="pair:organizationOfMembership"
            groupReference="MembershipRole"
            groupLabel="pair:label"
            filterProperty="pair:membershipRole"
          >
            <SingleFieldList linkType={false}>
              <ReferenceField reference="Person" source="pair:membershipActor" referenceBasePath="/User" link="show">
                <UserIcon
                  styles={{
                    image: {
                      height: '150px',
                      width: 'auto',
                      margin: 'auto',
                      display: 'block'
                    },
                    parent: {
                      margin: '10px',
                      width: '150px'
                    }
                  }}
                />
              </ReferenceField>
            </SingleFieldList>
          </ReifiedArrayField>
          <ReferenceArrayField reference="Organization" source="pair:partnerOf">
            <GridList xs={6} linkType="show">
              <AvatarField label="pair:label" image="image">
                <HomeIcon />
              </AvatarField>
            </GridList>
          </ReferenceArrayField>
          <ReferenceArrayField reference="Activity" source="pair:involvedIn">
            <SingleFieldList linkType="show">
              <ChipField source="pair:label" color="secondary" />
            </SingleFieldList>
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

export default OrganizationShow;
