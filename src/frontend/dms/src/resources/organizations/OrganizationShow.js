import React from 'react';
import { Show, TextField, UrlField } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import ColumnShowLayout from '../../components/ColumnShowLayout';
import Column from '../../components/Column';
import Hero from '../../components/Hero';
import MarkDownField from '../../components/MarkdownField';
import UriArrayField from '../../components/UriArrayField';
import UserIcon from '../../components/UserIcon';
import GridList from '../../components/GridList';

const useStyles = makeStyles(() => ({
  card: {
    padding: 25
  },
  singleFieldList: {
    margin: 0
  }
}));

const OrganizationTitle = ({ record }) => {
  return <span>{record ? record.label : ''}</span>;
};

const OrganizationShow = props => {
  const classes = useStyles();
  return (
    <Show classes={{ card: classes.card }} {...props}>
      <ColumnShowLayout>
        <Column xs={9}>
          <Hero title={<OrganizationTitle />}>
            <TextField label="Courte description" source="comment" />
            <UrlField label="Site web" source="homePage" />
          </Hero>
          <MarkDownField source="description" addLabel />
        </Column>
        <Column xs={3} showLabel>
          <UriArrayField label="Membres" reference="Person" source="hasMember" referenceBasePath="/User">
            <GridList xs={6} linkType="show">
              <UserIcon />
            </GridList>
          </UriArrayField>
        </Column>
      </ColumnShowLayout>
    </Show>
  );
};

export default OrganizationShow;
