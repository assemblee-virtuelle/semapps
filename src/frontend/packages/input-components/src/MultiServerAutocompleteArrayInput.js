import React, { useCallback, useState } from 'react';
import { AutocompleteArrayInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';
import OptionRenderer from './OptionRenderer';

const MultiServerAutocompleteArrayInput = ({ optionText, ...rest }) => {
  const dataServers = useDataServers();
  const [suggestion, setSuggestion] = useState("");
  const matchSuggestion = useCallback(
    (filterValue, choice) => {
      setSuggestion(filterValue)
      return ( choice[optionText].toLowerCase().match(filterValue.toLowerCase()) )
    }, [optionText]
  );
  return (
    <AutocompleteArrayInput
      matchSuggestion={matchSuggestion}
      optionText={<OptionRenderer optionText={optionText} dataServers={dataServers} suggestion={suggestion} />}
      {...rest}
    />
  );
};

export default MultiServerAutocompleteArrayInput;
