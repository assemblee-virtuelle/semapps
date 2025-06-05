import React, { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useListContext, useCreatePath } from 'react-admin';

const useFullCalendarProps = ({
  label,
  startDate,
  endDate,
  linkType = 'edit'
}: any) => {
  const { data, isLoading, resource } = useListContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createPath = useCreatePath();

  const query = new URLSearchParams(location.search);

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({
    event,
    jsEvent
  }: any) => {
    jsEvent.preventDefault();
    navigate(event.url);
  }, []);

  // Change the query string when month change
  const datesSet = useCallback(
    ({
      view
    }: any) => {
      // @ts-expect-error TS(2345): Argument of type '(params: URLSearchParams) => { m... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
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
    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    initialDate: query.has('month') ? new Date(query.get('year'), query.get('month') - 1) : new Date(),
    events,
    datesSet,
    eventClick
  };
};

export default useFullCalendarProps;
