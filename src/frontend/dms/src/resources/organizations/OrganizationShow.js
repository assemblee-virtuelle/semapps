import React from 'react';
import { Show, TextField, UrlField } from 'react-admin';
import ColumnShowLayout from '../../components/ColumnShowLayout';
import Column from '../../components/Column';
import Hero from '../../components/Hero';
import MarkDownField from '../../components/MarkdownField';
import UriArrayField from '../../components/UriArrayField';
import UserIcon from '../../components/UserIcon';
import GridList from '../../components/GridList';

const OrganizationTitle = ({ record }) => {
  return <span>{record ? record.label : ''}</span>;
};

const OrganizationShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={9}>
        <Hero title={<OrganizationTitle />}>
          <TextField label="Courte description" source="comment" />
          <UrlField label="Site web" source="homePage" />
        </Hero>
        <MarkDownField source="description" addLabel />
      </Column>
      <Column xs={3} showLabel>
        <UriArrayField label="Membres" reference="User" source="hasMember" referenceBasePath="/User">
          <GridList xs={6} linkType="show">
            <UserIcon />
          </GridList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default OrganizationShow;
