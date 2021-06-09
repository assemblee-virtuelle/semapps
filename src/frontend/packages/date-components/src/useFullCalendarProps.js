import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useListContext, linkToRecord } from 'react-admin';

const useFullCalendarProps = ({ label, startDate, endDate, linkType }) => {
  const history = useHistory();
  const { ids, data, basePath } = useListContext();

  let query = new URLSearchParams(history.location.search);

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({ event, jsEvent }) => {
    jsEvent.preventDefault();
    history.push(event.url);
  }, []);

  // Change the query string when month change
  const datesSet = useCallback(
    ({ view }) => {
      query.set('month', view.currentStart.getMonth() + 1);
      query.set('year', view.currentStart.getFullYear());
      history.replace({ pathname: history.location.pathname, search: '?' + query.toString() });
    },
    [query]
  );

  const events = useMemo(
    () =>
      ids.map(id => ({
        id,
        title: typeof label === 'string' ? data[id][label] : label(data[id]),
        start: typeof startDate === 'string' ? data[id][startDate] : startDate(data[id]),
        end: typeof endDate === 'string' ? data[id][endDate] : endDate(data[id]),
        url: linkToRecord(basePath, id) + '/' + linkType
      })),
    [data, ids, basePath]
  );

  return {
    initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
    events,
    datesSet,
    eventClick
  };
};

export default useFullCalendarProps;
