import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import PanToolIcon from '@material-ui/icons/PanTool';

const SkillList = props => (
  <List {...props}>
    <SimpleList primaryText={record => record['pair:label']} leftAvatar={() => <PanToolIcon />} linkType="show" />
  </List>
);

export default SkillList;
