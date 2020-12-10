import React from 'react';
import { ChipField, SingleFieldList, TextField, ReferenceField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField, SeparatedFieldList } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';

const OrganizationTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const OrganizationShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<OrganizationTitle />}>
          <TextField label="Courte description" source="pair:comment" />
          <ReferenceField label="Filiale de" source="pair:partOf" reference="Organization" linkType="show">
            <TextField source="pair:label" />
          </ReferenceField>
          <UriArrayField label="Type d'organisation" source="pair:hasSubjectType" reference="OrganizationType" linkType="show">
            <SeparatedFieldList linkType="show">
              <TextField source="pair:label" />
            </SeparatedFieldList>
          </UriArrayField>
        </Hero>
        <MarkdownField source="pair:description" addLabel />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField label="Partenaires" reference="Organization" source="pair:partnerOf">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Filiales" reference="Organization" source="pair:hasPart">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Connait" reference="Organization" source="pair:follows">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Connu par" reference="Organization" source="pair:hasFollower">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Participe à" reference="Event" source="pair:involvedIn">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Tags" reference="Theme" source="pair:hasTopic">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default OrganizationShow;
