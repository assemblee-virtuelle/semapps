import React, { useState } from 'react';
import { List } from 'react-admin';
import { useLocation } from 'react-router';
import ListActions from './ListActions';

const MultiViewsList = ({ children, actions, views, ...otherProps }) => {
  const query = new URLSearchParams(useLocation().search);
  const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
  const [currentView, setView] = useState(initialView);
  return (
    <List
      actions={React.cloneElement(actions, { views, currentView, setView, ...otherProps })}
      pagination={views[currentView].pagination}
      // Set initial values, but use the query string to change these values to avoid a complete refresh
      perPage={views[initialView].perPage}
      sort={views[initialView].sort}
      {...otherProps}
    >
      {views[currentView].list}
    </List>
  );
};

MultiViewsList.defaultProps = {
  actions: <ListActions />
};

export default MultiViewsList;
