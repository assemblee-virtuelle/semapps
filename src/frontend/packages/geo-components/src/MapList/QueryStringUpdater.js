import React from 'react';
import { useHistory } from 'react-router';
import { useMapEvents } from 'react-leaflet';

// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const QueryStringUpdater = () => {
  const history = useHistory();
  const query = new URLSearchParams(history.location.search);

  useMapEvents({
    moveend: test => {
      query.set('lat', test.target.getCenter().lat);
      query.set('lng', test.target.getCenter().lng);
      history.replace({ pathname: history.location.pathname, search: '?' + query.toString() });
    },
    zoomend: test => {
      query.set('zoom', test.target.getZoom());
      history.replace({ pathname: history.location.pathname, search: '?' + query.toString() });
    }
  });
  return null;
};

export default QueryStringUpdater;
