import React from 'react';
import { SimpleForm, TextInput, ImageInput, NumberInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit, MapBoxInput } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput } from '../../../../inputs';
import OrganizationTitle from './OrganizationTitle';

const extractContext = (context, key) => {
  const property = context.find(property => property.id.startsWith(key+'.'));
  if( property ) return property.text;
}

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:homePage" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput source="pair:affiliates" />
      <OrganizationsInput source="pair:partnerOf" />
      <EventsInput source="pair:involvedIn" />
      <ThemesInput source="pair:hasTopic" />
      <DocumentsInput source="pair:documentedBy" />
      <MapBoxInput
        source="pair:hasLocation"
        config={{
          access_token: 'pk.eyJ1Ijoic3Jvc3NldDgxIiwiYSI6ImNra3ptM3A5djFibDYycW80ZThwYjdpNXcifQ.l_t7_-T2XG_7--5udKYzLQ',
          types: ['place', 'address'],
          country: ['fr', 'be', 'ch']
        }}
        parse={value => ({
          type: 'pair:Place',
          'pair:label': value.place_name,
          'pair:longitude': value.center[0],
          'pair:latitude': value.center[1],
          'pair:hasPostalAddress': {
            type: 'pair:PostalAddress',
            'pair:addressLocality': value.place_type[0] === 'place' ? value.text : extractContext(value.context, 'place'),
            'pair:addressStreet': value.place_type[0] === 'address' ? [value.address, value.text].join(' ') : undefined,
            'pair:addressZipCode': extractContext(value.context, 'postcode'),
            'pair:addressCountry': extractContext(value.context, 'country')
          }
        })}
        optionText={resource => resource['pair:label']}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
