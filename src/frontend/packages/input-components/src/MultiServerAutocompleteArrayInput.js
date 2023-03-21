import React, { useCallback, useState } from 'react';
import { AutocompleteArrayInput } from 'react-admin';
import { useDataServers } from '@semapps/semantic-data-provider';
import OptionRenderer from './OptionRenderer';

const MultiServerAutocompleteArrayInput = ({ optionText, ...rest }) => {
  const dataServers = useDataServers();
  const [keyword, setKeyword] = useState("");
  const matchSuggestion = useCallback(
    (filterValue, choice) => {
      setKeyword(filterValue)
      return ( choice[optionText].toLowerCase().match(filterValue.toLowerCase()) )
    }, [optionText]
  );
  return (
    <AutocompleteArrayInput
      matchSuggestion={matchSuggestion}
      optionText={<OptionRenderer 
        optionText={optionText} 
        dataServers={dataServers} 
        keyword={keyword}
        {...rest}
        />}
      {...rest}
    />
  );
};

export default MultiServerAutocompleteArrayInput;
