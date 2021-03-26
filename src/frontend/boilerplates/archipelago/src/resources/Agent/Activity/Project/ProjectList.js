import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import ProjectFilterSidebar from "./ProjectFilterSidebar";

const ProjectList = props => (
  <List aside={<ProjectFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record['pair:comment']}
      leftAvatar={() => <img src={process.env.PUBLIC_URL + '/logo192.png'} width="100%" alt="SemApps" />}
      linkType="show"
    />
  </List>
);

export default ProjectList;
