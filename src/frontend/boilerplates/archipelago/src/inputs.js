import React from 'react';
import { UriArrayInput } from '@semapps/semantic-data-provider';
import { AutocompleteArrayInput } from 'react-admin';
import * as resources from './resources';

const selectOptionTextByType = resource => {
  if (resource) {
    const matchingResourceKey = Object.keys(resources).find(resourceKey => {
      if (resources[resourceKey].dataModel.types.length === 1) {
        if (
          resources[resourceKey].dataModel.types[0] === resource['@type'] ||
          (Array.isArray(resource['@type']) && resource['@type'].includes(resources[resourceKey].dataModel.types[0]))
        ) {
          return true;
        }
      }
      return false;
    });

    if (Array.isArray(resources[matchingResourceKey].dataModel.slugField)) {
      return resources[matchingResourceKey].dataModel.slugField.map(field => resource[field]).join(' ');
    } else {
      return resource[resources[matchingResourceKey].dataModel.slugField];
    }
  } else {
    return null;
  }
};

export const OrganizationsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Organization" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const ActorsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Actor" source={source}>
    <AutocompleteArrayInput
      optionText={selectOptionTextByType}
      shouldRenderSuggestions={value => value.length > 1}
      fullWidth
    />
  </UriArrayInput>
);

export const ActivitiesInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Activity" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const DocumentsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Document" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const EventsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Event" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const SkillsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Skill" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const ThemesInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Theme" source={source}>
    <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
  </UriArrayInput>
);

export const UsersInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="User" source={source}>
    <AutocompleteArrayInput
      optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
      shouldRenderSuggestions={value => value.length > 1}
      fullWidth
    />
  </UriArrayInput>
);

export const SubjectsInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Subject" source={source}>
    <AutocompleteArrayInput
      optionText={selectOptionTextByType}
      shouldRenderSuggestions={value => value.length > 1}
      fullWidth
    />
  </UriArrayInput>
);
