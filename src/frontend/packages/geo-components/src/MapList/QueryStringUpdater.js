import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const QueryStringUpdater = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  useMapEvents({
    moveend: test => {
      query.set('lat', test.target.getCenter().lat);
      query.set('lng', test.target.getCenter().lng);
      navigate.replace({ pathname: navigate.location.pathname, search: '?' + query.toString() });
    },
    zoomend: test => {
      query.set('zoom', test.target.getZoom());
      navigate.replace({ pathname: navigate.location.pathname, search: '?' + query.toString() });
    }
  });
  return null;
};

export default QueryStringUpdater;
