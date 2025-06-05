import React, { useCallback } from 'react';
import { AutocompleteInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';

const MultiServerAutocompleteInput = ({
  optionText,
  ...rest
}: any) => {
  const dataServers = useDataServers();
  // We cannot use OptionRenderer like MultiServerAutocompleteArrayInput because there is a bug with AutocompleteInput
  const optionTextWithServerName = useCallback(
    (record: any) => {
      if (record && dataServers) {
        const server = Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
        return record[optionText] + (server ? ` (${server.name})` : '');
      }
    },
    [optionText, dataServers]
  );
  return <AutocompleteInput optionText={optionTextWithServerName} {...rest} />;
};

export default MultiServerAutocompleteInput;
