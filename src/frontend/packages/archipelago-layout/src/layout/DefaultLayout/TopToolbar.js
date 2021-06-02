import React from 'react';
import { useSelector } from 'react-redux';
import { TopToolbar as RaTopToolbar } from 'react-admin';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  topToolBar: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  titleContainer: props => ({
    maxWidth: props.sidebarOpen ? 'calc(100vw - 300px)' : 'calc(100vw - 100px)',
    position: 'relative',
    top: -8,
    marginRight: 8,
    [theme.breakpoints.down('xs')]: {
      top: 0,
      marginRight: 0,
      maxWidth: '90vw'
    }
  }),
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8rem'
    }
  },
  actionsContainer: props => ({
    whiteSpace: 'nowrap',
    marginLeft: 'auto',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      height: props.currentView === 'list' ? 0 : 'auto'
    }
  })
}));

const TopToolbar = ({ children, currentView, ...otherProps }) => {
  const sidebarOpen = useSelector(state => state.admin.ui.sidebarOpen);
  const classes = useStyles({ currentView, sidebarOpen });
  return (
    <RaTopToolbar classes={{ root: classes.topToolBar }}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} variant="h4" color="primary" id="react-admin-title" component="h1" />
      </div>
      <div className={classes.actionsContainer}>{children}</div>
    </RaTopToolbar>
  );
};

export default TopToolbar;
