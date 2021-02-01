import React from 'react';
import { AppBar as RaAppBar } from 'react-admin';
import { Hidden, makeStyles } from '@material-ui/core';
import SearchForm from '../SearchForm';

const useStyles = makeStyles({
  toolbar: {
    height: 56
  },
  spacer: {
    flex: 1
  },
  searchForm: {
    flex: 2
  }
});

const AppBar = props => {
  const classes = useStyles();
  return (
    <RaAppBar {...props} classes={{ toolbar: classes.toolbar, ...props.classes }} color="primary">
      <span className={classes.spacer} />
      <Hidden only="xs">
        <span className={classes.searchForm}>
          <SearchForm />
        </span>
      </Hidden>
      <span className={classes.spacer} />
    </RaAppBar>
  );
};

export default AppBar;
