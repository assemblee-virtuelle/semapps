import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const ThemeList = props => (
  <List {...props}>
    <SimpleList primaryText={record => record['pair:label']} leftAvatar={() => <LocalOfferIcon />} linkType="show" />
  </List>
);

export default ThemeList;
