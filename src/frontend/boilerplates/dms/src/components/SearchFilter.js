import React from 'react';
import { Filter, TextInput } from 'react-admin';

const SearchFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

export default SearchFilter;
