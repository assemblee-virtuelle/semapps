import React from 'react';
import { TextField, UrlField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, UserIcon, GridList, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';

const OrganizationTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const OrganizationShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<OrganizationTitle />} image="image">
          <TextField label="Courte description" source="pair:comment" />
          <UrlField label="Site web" source="pair:homePage" />
        </Hero>
        <MarkdownField source="pair:description" addLabel />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField label="Membres" reference="User" source="pair:hasMember" referenceBasePath="/User">
          <GridList xs={6} linkType="show">
            <UserIcon />
          </GridList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default OrganizationShow;
