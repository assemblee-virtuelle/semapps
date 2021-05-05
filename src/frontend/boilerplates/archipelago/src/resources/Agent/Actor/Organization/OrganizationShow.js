import React from 'react';
import { TextField, UrlField, ChipField, SingleFieldList, SimpleList, ArrayField } from 'react-admin';
import { Grid } from '@material-ui/core';
import {
  MainList,
  SideList,
  Hero,
  GridList,
  Show,
  MarkdownField,
  AvatarField,
  SeparatedListField,
  RightLabel,
  LargeLabel
} from '@semapps/archipelago-layout';
import { MapField } from '@semapps/geo-components';
import {
  ReferenceArrayField,
  ReferenceField,
  GroupedReferenceHandler,
  FilterHandler
} from '@semapps/semantic-data-provider';
import OrganizationTitle from './OrganizationTitle';
import DescriptionIcon from '@material-ui/icons/Description';
import HomeIcon from '@material-ui/icons/Home';

const ConditionalSourceDefinedHandler = ({record,source,children,...otherProps})=>{
  if (record?.[source] && (!Array.isArray(record[source])||record[source].length>0)){
    return  React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {...otherProps,record,source});
      })
  }else{
    return <></>
  }
}


const OrganizationShow = props => (
  <Show title={<OrganizationTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
          <UrlField source="pair:homePage" />
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
          <GroupedReferenceHandler
            source="pair:organizationOfMembership"
            groupReference="MembershipRole"
            groupLabel="pair:label"
            filterProperty="pair:membershipRole"
            addLabel={false}
          >

            <ConditionalSourceDefinedHandler>
              <RightLabel/>
              <ArrayField source="pair:organizationOfMembership">
                <GridList xs={6} linkType={false}>
                  <ReferenceField reference="Person" source="pair:membershipActor" link="show">
                    <AvatarField
                      label={record => `${record['pair:firstName']} ${record['pair:lastName']}`}
                      image="image"
                    />
                  </ReferenceField>
                </GridList>
              </ArrayField>
            </ConditionalSourceDefinedHandler>
          </GroupedReferenceHandler>
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
