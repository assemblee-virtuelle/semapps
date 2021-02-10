import React from 'react';
import { useListContext, ShowButton, EditButton, useResourceDefinition } from 'react-admin';
import { Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import { MapContainer, useMapEvents, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const PopupContent = ({ record, basePath }) => {
  const resourceDefinition = useResourceDefinition({});
  return (
    <>
      {record.label && <Typography variant="h5">{record.label}</Typography>}
      {record.description && (
        <Typography>
          {record.description.length > 150 ? record.description.substring(0, 150) + '...' : record.description}
        </Typography>
      )}
      {resourceDefinition.hasShow && <ShowButton basePath={basePath} record={record} />}
      {resourceDefinition.hasEdit && <EditButton basePath={basePath} record={record} />}
    </>
  );
};

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

const MapList = ({ latitude, longitude, label, description, popupContent, center, zoom, ...otherProps }) => {
  const { ids, data, basePath } = useListContext();

  // Get the zoom and center from query string, if available
  const query = new URLSearchParams(useLocation().search);
  center = query.has('lat') && query.has('lng') ? [query.get('lat'), query.get('lng')] : center;
  zoom = query.has('zoom') ? query.get('zoom') : zoom;

  return (
    <MapContainer style={{ height: 700 }} center={center} zoom={zoom} {...otherProps}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup showCoverageOnHover={false}>
        {ids.map(id => {
          const record = {
            ...data[id],
            latitude: latitude && latitude(data[id]),
            longitude: longitude && longitude(data[id]),
            label: label && label(data[id]),
            description: description && description(data[id])
          };

          // Display a marker only if there is a latitude and longitude
          if (record.latitude && record.longitude) {
            return (
              <Marker key={id} position={[record.latitude, record.longitude]}>
                <Popup>{React.createElement(popupContent, { record, basePath })}</Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </MarkerClusterGroup>
      <QueryStringUpdater />
    </MapContainer>
  );
};

MapList.defaultProps = {
  height: 700,
  center: [47, 2.213749],
  zoom: 6,
  scrollWheelZoom: false,
  popupContent: PopupContent
};

export default MapList;
