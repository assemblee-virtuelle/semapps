import React from 'react';
import { TextField, UrlField, ChipField, SingleFieldList, SimpleList, ArrayField } from 'react-admin';
import { Box, Grid } from '@material-ui/core';
import {
  MainList,
  SideList,
  Hero,
  GridList,
  MarkdownField,
  AvatarField,
  SeparatedListField,
  RightLabel
} from '@semapps/archipelago-layout';
import { ShowWithPermissions } from '@semapps/auth-provider';
import { MapField } from '@semapps/geo-components';
import { ReferenceArrayField, ReferenceField, GroupedReferenceHandler } from '@semapps/semantic-data-provider';
import OrganizationTitle from './OrganizationTitle';
import DescriptionIcon from '@material-ui/icons/Description';
import HomeIcon from '@material-ui/icons/Home';

const UrlArrayField = ({ record, source }) => {
  let links = typeof record[source] === 'string' ? [record[source]] : record[source];
  let index = 0;
  for (let link of links) {
    if (link.startsWith('https://')) {
      links[index] = link.split('https://')[1];
    }
    index++;
  }

  return record
    ? links.map(item => (
        <div>
          <a href={'https://' + item} target="_blank">
            {item}
          </a>
        </div>
      ))
    : null;
};
UrlArrayField.defaultProps = { addLabel: true };

const ConditionalSourceDefinedHandler = ({ record, source, children, ...otherProps }) => {
  if (record?.[source] && (!Array.isArray(record[source]) || record[source].length > 0)) {
    return React.Children.map(children, (child, i) => {
      return React.cloneElement(child, { ...otherProps, record, source });
    });
  } else {
    return <></>;
  }
};

const OrganizationShow = props => (
  <ShowWithPermissions title={<OrganizationTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
          <UrlArrayField source="pair:homePage" />
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
              <RightLabel mb={0} />
              <ArrayField source="pair:organizationOfMembership">
                <Box mb={4}>
                  <GridList xs={6} linkType={false}>
                    <ReferenceField reference="Person" source="pair:membershipActor" link="show">
                      <AvatarField label="pair:label" image="image" />
                    </ReferenceField>
                  </GridList>
                </Box>
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
  </ShowWithPermissions>
);

export default OrganizationShow;
