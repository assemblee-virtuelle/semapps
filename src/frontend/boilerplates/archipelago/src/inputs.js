import React from 'react';
import { UriArrayInput } from '@semapps/semantic-data-provider';
import { AutocompleteArrayInput } from 'react-admin';

export const OrganizationsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Organization" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const EventsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Event" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const ThemesInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Theme" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const OrganizationTypesInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="OrganizationType" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const PlacesInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Place" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);
