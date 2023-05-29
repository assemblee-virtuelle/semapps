import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListContext, useCreatePath } from 'react-admin';

const useFullCalendarProps = ({ label, startDate, endDate, linkType }) => {
  const navigate = useNavigate();
  const { ids, data, resource } = useListContext();
  const createPath = useCreatePath();

  let query = new URLSearchParams(navigate.location.search);

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({ event, jsEvent }) => {
    jsEvent.preventDefault();
    navigate(event.url);
  }, []);

  // Change the query string when month change
  const datesSet = useCallback(
    ({ view }) => {
      query.set('month', view.currentStart.getMonth() + 1);
      query.set('year', view.currentStart.getFullYear());
      navigate.replace({ pathname: navigate.location.pathname, search: '?' + query.toString() });
    },
    [query]
  );

  const events = useMemo(
    () =>
      ids
        .filter(id => data[id])
        .map(id => ({
          id,
          title: typeof label === 'string' ? data[id][label] : label(data[id]),
          start: typeof startDate === 'string' ? data[id][startDate] : startDate(data[id]),
          end: typeof endDate === 'string' ? data[id][endDate] : endDate(data[id]),
          url: createPath({ resource, id, type: linkType })
        })),
    [data, ids, resource]
  );

  return {
    initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
    events,
    datesSet,
    eventClick
  };
};

export default useFullCalendarProps;
