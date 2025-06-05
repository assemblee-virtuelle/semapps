import { useMapEvents } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';

// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const QueryStringUpdater = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useMapEvents({
    moveend: (test: any) => {
      setSearchParams(params => ({
        ...Object.fromEntries(params),
        lat: test.target.getCenter().lat,
        lng: test.target.getCenter().lng,
        zoom: test.target.getZoom()
      }));
    },
    zoomend: (test: any) => {
      setSearchParams(params => ({
        ...Object.fromEntries(params),
        zoom: test.target.getZoom()
      }));
    }
  });

  return null;
};

export default QueryStringUpdater;
