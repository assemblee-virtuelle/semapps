import React from 'react';
import { List, SimpleList } from 'react-admin';

const ProjectList = props => {
  return (
    <List title="Projets" perPage={25} {...props}>
      <SimpleList
        primaryText={record => record['pair:label']}
        secondaryText={record => record['pair:comment']}
        leftAvatar={() => <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" alt="Assemblée virtuelle" />}
        linkType="show"
      />
    </List>
  );
};

export default ProjectList;
