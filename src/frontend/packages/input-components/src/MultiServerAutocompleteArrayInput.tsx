import React, { useCallback } from 'react';
import { AutocompleteArrayInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';
import OptionRenderer from './OptionRenderer';

const MultiServerAutocompleteArrayInput = ({
  optionText,
  ...rest
}: any) => {
  const dataServers = useDataServers();
  const matchSuggestion = useCallback(
    (filterValue: any, choice: any) => choice[optionText].toLowerCase().match(filterValue.toLowerCase()),
    [optionText]
  );
  return (
    <AutocompleteArrayInput
      matchSuggestion={matchSuggestion}
      optionText={<OptionRenderer optionText={optionText} dataServers={dataServers} />}
      inputText={choice => choice[optionText]}
      {...rest}
    />
  );
};

export default MultiServerAutocompleteArrayInput;
