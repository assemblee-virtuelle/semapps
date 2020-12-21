import React from 'react';
import { ChipField, SingleFieldList, TextField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, MarkdownField } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import {SeparatedFieldList} from "../../fields";

const PlaceTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

const EventShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<PlaceTitle />}>
          <TextField label="Courte description" source="pair:comment" />
          <UriArrayField label="Fait partie de" reference="Place" source="pair:partOf">
            <SeparatedFieldList linkType="show">
              <TextField source="pair:label" />
            </SeparatedFieldList>
          </UriArrayField>
        </Hero>
        <MarkdownField source="pair:description" addLabel />
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField
          label="Organisations"
          filter={{ '@type': 'pair:Organization' }}
          reference="Organization"
          source="pair:hosts"
        >
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Evénements" filter={{ '@type': 'pair:Event' }} reference="Event" source="pair:hosts">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Parties" reference="Place" source="pair:hasPart">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default EventShow;
