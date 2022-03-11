import React, { useCallback } from 'react';
import { AutocompleteArrayInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';
import OptionRenderer from './OptionRenderer';

const MultiServerAutocompleteArrayInput = ({ optionText, ...rest }) => {
  const dataServers = useDataServers();
  const matchSuggestion = useCallback(
    (filterValue, choice) => choice[optionText].toLowerCase().match(filterValue.toLowerCase()),
    [optionText]
  );
  return (
    <AutocompleteArrayInput
      matchSuggestion={matchSuggestion}
      optionText={<OptionRenderer optionText={optionText} dataServers={dataServers} />}
      {...rest}
    />
  );
};

export default MultiServerAutocompleteArrayInput;
