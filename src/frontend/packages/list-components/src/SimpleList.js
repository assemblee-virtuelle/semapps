import React from 'react';
import { SimpleList as RaSimpleList } from 'react-admin';

const SimpleList = props => (
  <RaSimpleList
    {...props}
    rowStyle={() => ({
      padding: 15,
      paddingBottom: 15,
      paddingTop: 15,
      marginBottom: 10,
      borderStyle: 'solid',
      borderColor: '#e0e0e0',
      borderWidth: 1
    })}
  />
);

export default SimpleList;
