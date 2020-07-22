import * as React from 'react';
import { useListContext } from 'react-admin';
import { Grid } from '@material-ui/core';

const GridList = ({ children }) => {
  const { ids, data, basePath } = useListContext();
  return (
    <Grid container spacing={3}>
      {ids.map(id => (
        React.cloneElement(children, {
          record: data[id],
          basePath
        })
        )
      )}
    </Grid>
  );
};

export default GridList;
