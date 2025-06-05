import React from 'react';
import { Button, Link } from 'react-admin';
import { useLocation } from 'react-router';
import ListViewContext from './ListViewContext';

const ViewsButtons = () => {
  const query = new URLSearchParams(useLocation().search);
  const { views, currentView, setView } = React.useContext(ListViewContext);
  return views
    ? Object.entries(views)
        .filter(([key]) => key !== currentView)
        .map(([key, view]) => {
          query.set('view', key);
          // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
          query.set('page', 1);
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          query.set('perPage', view.perPage);
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          if (view.sort) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            query.set('sort', view.sort.field);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            query.set('order', view.sort.order);
          }
          return (
            <Link key={key} to={`?${query.toString()}`}>
              <Button
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                onClick={() => setView(key)}
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                label={view.label}
              >
                {
                  // @ts-expect-error TS(2571): Object is of type 'unknown'.
                  React.createElement(view.icon)
                }
              </Button>
            </Link>
          );
        })
    : null;
};

export default ViewsButtons;
