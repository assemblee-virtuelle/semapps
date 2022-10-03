import React from 'react';
import { getResources } from 'react-admin';
import { Tabs, Tab, useMediaQuery, makeStyles } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import { shallowEqual, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  tab: {
    minWidth: 55
  }
}));

/**
 * @deprecated Moved to OrganiGraph
 */
const TabsMenu = () => {
  const history = useHistory();

  const classes = useStyles();

  const location = useLocation();
  const matches = location.pathname.match(/^\/([^/]+)/);
  const currentResource = matches ? matches[1] : null;

  const resources = useSelector(getResources, shallowEqual);

  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'));

  return (
    <Tabs
      value={currentResource}
      onChange={(_, value) => history.push('/' + value)}
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="auto"
    >
      {resources
        .filter(resource => resource.hasList)
        .map(resource => (
          <Tab
            key={resource.name}
            icon={React.createElement(resource.icon)}
            label={xs ? undefined : resource.options.label}
            value={resource.name}
            className={classes.tab}
          />
        ))}
    </Tabs>
  );
};

export default TabsMenu;
