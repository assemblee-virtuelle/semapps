import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import PanToolIcon from '@material-ui/icons/PanTool';

const SkillList = props => (
  <ListWithPermissions {...props}>
    <SimpleList primaryText={record => record['pair:label']} leftAvatar={() => <PanToolIcon />} linkType="show" />
  </ListWithPermissions>
);

export default SkillList;
