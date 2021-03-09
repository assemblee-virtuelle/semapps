import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

/**
 * @deprecated
 */
const ColumnShowLayout = props => {
  const { basePath, children, record, resource } = props;

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={5}>
        {React.Children.map(children, column =>
          column && React.isValidElement(column)
            ? React.cloneElement(column, {
                resource,
                record,
                basePath
              })
            : null
        )}
      </Grid>
    </div>
  );
};

export default ColumnShowLayout;
