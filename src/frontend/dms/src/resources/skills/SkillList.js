import React from 'react';
import { List, SimpleList } from 'react-admin';
import ResourceTabs from '../../components/ResourceTabs';

const SkillList = props => (
  <List title="Compétences" perPage={25} {...props}>
    <>
      <ResourceTabs />
      <SimpleList
        primaryText={record => record['pair:label']}
        leftAvatar={() => <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" alt="Assemblée virtuelle" />}
        linkType="edit"
      />
    </>
  </List>
);

export default SkillList;
