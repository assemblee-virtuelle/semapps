import React, { useState } from 'react';
import { List, ListActions } from 'react-admin';
import { useLocation } from 'react-router';

const MultiViewsList = ({ children, actions, views, ListComponent, ...otherProps }) => {
  const query = new URLSearchParams(useLocation().search);
  const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
  const [currentView, setView] = useState(initialView);
  return (
    <ListComponent
      actions={React.cloneElement(actions, { views, currentView, setView, ...otherProps })}
      pagination={views[currentView].pagination}
      // Set initial values, but use the query string to change these values to avoid a complete refresh
      perPage={views[initialView].perPage}
      sort={views[initialView].sort}
      {...otherProps}
    >
      {views[currentView].list}
    </ListComponent>
  );
};

MultiViewsList.defaultProps = {
  actions: <ListActions />,
  ListComponent: List
};

export default MultiViewsList;
