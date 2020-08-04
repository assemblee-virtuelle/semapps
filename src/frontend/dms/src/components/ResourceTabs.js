import React from "react";
import { Tabs, Tab } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';

const ResourceTabs = () => {
  const history = useHistory();

  const location = useLocation();
  const matches = location.pathname.match(/^\/([^/]+)/);
  const currentResource = matches ? matches[1] : null;

  return(
    <Tabs
      value={currentResource}
      onChange={(_, value) => history.push('/' + value)}
      indicatorColor="primary"
      textColor="primary"
    >
      <Tab label="Organisations" value="Organization" />
      <Tab label="Projets" value="Project" />
      <Tab label="Personnes" value="User" />
    </Tabs>
  );
};

export default ResourceTabs;
