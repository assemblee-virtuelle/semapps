import React from 'react';
import { FilterLiveSearch } from 'react-admin';
import { Card, CardContent, makeStyles } from '@material-ui/core';
import { ReferenceFilter } from '@semapps/archipelago-layout';

const useStyles = makeStyles(theme => ({
  card: {
    paddingTop: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: '15em',
      marginLeft: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }
}));

const ProjectFilterSidebar = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent>
        <FilterLiveSearch />
        <ReferenceFilter reference="Theme" source="pair:hasTopic" />
      </CardContent>
    </Card>
  );
}

export default ProjectFilterSidebar;
