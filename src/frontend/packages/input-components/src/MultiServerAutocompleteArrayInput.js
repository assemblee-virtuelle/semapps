import React, { useCallback } from 'react';
import { AutocompleteArrayInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';

const MultiServerAutocompleteArrayInput = ({ optionText, ...rest }) => {
  const dataServers = useDataServers();
  const optionTextWithServerName = useCallback(
    record => {
      if (record) {
        const server = Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
        return (
          <span>
            {record[optionText]}
            {server && (
              <em className="serverName" style={{ color: 'grey' }}>
                &nbsp;({server.name})
              </em>
            )}
          </span>
        );
      }
    },
    [optionText, dataServers]
  );
  const matchSuggestion = useCallback(
    (filterValue, choice) => choice[optionText].toLowerCase().match(filterValue.toLocaleString()),
    [optionText]
  );
  return <AutocompleteArrayInput matchSuggestion={matchSuggestion} optionText={optionTextWithServerName} {...rest} />;
};

export default MultiServerAutocompleteArrayInput;
