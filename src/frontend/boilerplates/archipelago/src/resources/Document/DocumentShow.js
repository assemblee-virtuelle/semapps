import React from 'react';
import { SingleFieldList, ChipField } from 'react-admin';
import { Typography } from '@material-ui/core';
import { Column, ColumnShowLayout, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import DocumentTitle from './DocumentTitle';

const EventShow = props => (
  <Show title={<DocumentTitle />} {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
        <MarkdownField source="pair:description" />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField
          label="Organisations"
          filter={{ '@type': 'pair:Organization' }}
          reference="Organization"
          source="pair:documents"
        >
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Projets" filter={{ '@type': 'pair:Project' }} reference="Project" source="pair:documents">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
