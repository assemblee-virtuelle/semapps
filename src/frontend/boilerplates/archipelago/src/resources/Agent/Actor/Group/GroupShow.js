import React from 'react';
import { TextField, ChipField, SingleFieldList } from 'react-admin';
import { Column, ColumnShowLayout, Hero, GridList, MarkdownField, AvatarField } from '@semapps/archipelago-layout';
import { ShowWithPermissions } from '@semapps/auth-provider';
import { UriArrayField } from '@semapps/semantic-data-provider';
import GroupTitle from './GroupTitle';

const GroupShow = props => (
  <ShowWithPermissions title={<GroupTitle />} {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
        </Hero>
        <MarkdownField source="pair:description" />
        <br />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField reference="Person" source="pair:affiliates">
          <GridList xs={6} linkType="show">
            <AvatarField label="pair:label" image="image" />
          </GridList>
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
        <UriArrayField reference="Document" source="pair:documentedBy">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </ShowWithPermissions>
);

export default GroupShow;
