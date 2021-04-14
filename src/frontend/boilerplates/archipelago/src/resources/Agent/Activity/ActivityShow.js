import React from 'react';
import { Show } from 'react-admin';
import { Redirect } from 'react-router';

const RedirectByType = ({ record }) => {
  if (record) {
    if (record.type === 'pair:Project') {
      return <Redirect to={`/Project/${encodeURIComponent(record.id)}/show`} />;
    } else {
      return <Redirect to={`/Event/${encodeURIComponent(record.id)}/show`} />;
    } else {
      return <Redirect to={`/Task/${encodeURIComponent(record.id)}/show`} />;
    }
  }
  return null;
};

const ActivityShow = props => (
  <Show {...props}>
    <RedirectByType />
  </Show>
);

export default ActivityShow;
