import React, { useState } from 'react';
import { List } from 'react-admin';
import { useLocation } from 'react-router';
import ListActionsWithViews from './ListActionsWithViews';
import ListViewContext from './ListViewContext';

const MultiViewsList = ({
  children,
  actions = <ListActionsWithViews />,
  views,
  ListComponent = List,
  ...otherProps
}) => {
  const query = new URLSearchParams(useLocation().search);
  const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
  const [currentView, setView] = useState(initialView);

  return (
    <ListViewContext.Provider value={{ views, currentView, setView }}>
      <ListComponent
        actions={actions}
        pagination={views[currentView].pagination}
        // Set initial values, but use the query string to change these values to avoid a complete refresh
        perPage={views[initialView].perPage}
        sort={views[initialView].sort}
        {...otherProps}
      >
        {views[currentView].list}
      </ListComponent>
    </ListViewContext.Provider>
  );
};

export default MultiViewsList;
