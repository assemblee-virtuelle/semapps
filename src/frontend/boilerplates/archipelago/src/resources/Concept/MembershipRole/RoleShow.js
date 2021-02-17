import React from 'react';
import { ChipField, SingleFieldList, TextField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField, UserIcon, GridList } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import { Typography } from '@material-ui/core';

const RoleTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const RoleShow = props => (
  <Show title={<RoleTitle />} {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default RoleShow;
