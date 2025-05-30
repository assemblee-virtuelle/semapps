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
          query.set('page', 1);
          query.set('perPage', view.perPage);
          if (view.sort) {
            query.set('sort', view.sort.field);
            query.set('order', view.sort.order);
          }
          return (
            <Link key={key} to={`?${query.toString()}`}>
              <Button onClick={() => setView(key)} label={view.label}>
                {React.createElement(view.icon)}
              </Button>
            </Link>
          );
        })
    : null;
};

export default ViewsButtons;
