import React from 'react';
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
  },
  cardContent: {
    paddingTop: 0
  }
}));

const ProjectFilterSidebar = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <ReferenceFilter reference="Theme" source="pair:hasTopic" inverseSource="pair:topicOf" limit={100} sort={{ field: 'pair:label', order: 'DESC' }} />
      </CardContent>
    </Card>
  );
}

export default ProjectFilterSidebar;
