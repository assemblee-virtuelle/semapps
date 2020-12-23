import React from 'react';
import { List } from 'react-admin';
import { MasonryList } from '@semapps/archipelago-layout';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  content: {
    padding: 0
  }
}));

const ProjectList = props => {
  const classes = useStyles();
  return (
    <List component="div" perPage={50} classes={{ content: classes.content }} {...props}>
      <MasonryList
        image={record => record.image}
        content={record => (
          <>
            <Typography variant="subtitle1">{record['pair:label']}</Typography>
            <Typography variant="body2" color="textSecondary" component="p">{record['pair:comment']}</Typography>
          </>
        )}
        linkType="show"
      />
    </List>
  );
}

export default ProjectList;
