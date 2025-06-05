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
}: any) => {
  const query = new URLSearchParams(useLocation().search);
  const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
  const [currentView, setView] = useState(initialView);

  return (
    // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'nu... Remove this comment to see the full error message
    <ListViewContext.Provider value={{ views, currentView, setView }}>
      <ListComponent
        actions={actions}
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        pagination={views[currentView].pagination}
        // Set initial values, but use the query string to change these values to avoid a complete refresh
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        perPage={views[initialView].perPage}
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        sort={views[initialView].sort}
        {...otherProps}
      >
        {
          // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
          views[currentView].list
        }
      </ListComponent>
    </ListViewContext.Provider>
  );
};

export default MultiViewsList;
