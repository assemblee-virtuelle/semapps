import React, { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useListContext, useCreatePath } from 'react-admin';

const useFullCalendarProps = ({ label, startDate, endDate, linkType = 'edit' }) => {
  const { data, isLoading, resource } = useListContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createPath = useCreatePath();

  const query = new URLSearchParams(location.search);

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({ event, jsEvent }) => {
    jsEvent.preventDefault();
    navigate(event.url);
  }, []);

  // Change the query string when month change
  const datesSet = useCallback(
    ({ view }) => {
      setSearchParams(params => ({
        ...params,
        month: view.currentStart.getMonth() + 1,
        year: view.currentStart.getFullYear()
      }));
    },
    [setSearchParams]
  );

  const events = useMemo(
    () =>
      !isLoading &&
      data
        .filter(record => record)
        .map(record => ({
          id: record.id,
          title: typeof label === 'string' ? record[label] : label(record),
          start: typeof startDate === 'string' ? record[startDate] : startDate(record),
          end: typeof endDate === 'string' ? record[endDate] : endDate(record),
          url: createPath({ resource, id: record.id, type: linkType })
        })),
    [isLoading, data, resource, createPath]
  );

  return {
    initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
    events,
    datesSet,
    eventClick
  };
};

export default useFullCalendarProps;
