import React from 'react';
import { getResources } from 'react-admin';
import { Tabs, Tab, useMediaQuery } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import { shallowEqual, useSelector } from 'react-redux';

const ResourceTabs = () => {
  const history = useHistory();

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
          />
        ))}
    </Tabs>
  );
};

export default ResourceTabs;
