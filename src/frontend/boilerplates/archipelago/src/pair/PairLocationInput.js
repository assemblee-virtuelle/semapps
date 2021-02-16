import React from 'react';
import { extractContext, LocationInput } from '@semapps/geo-components';

const PairLocationInput = props => (
  <LocationInput
    mapboxConfig={{
      access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
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
    {...props}
  />
);

export default PairLocationInput;
