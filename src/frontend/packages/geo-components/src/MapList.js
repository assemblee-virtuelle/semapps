import React from 'react';
import { useListContext } from 'react-admin';
import { useLocation } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import DefaultPopupContent from './DefaultPopupContent';
import QueryStringUpdater from './QueryStringUpdater';

const MapList = ({ latitude, longitude, label, description, popupContent, height, center, zoom, ...otherProps }) => {
  const { ids, data, basePath } = useListContext();

  // Get the zoom and center from query string, if available
  const query = new URLSearchParams(useLocation().search);
  center = query.has('lat') && query.has('lng') ? [query.get('lat'), query.get('lng')] : center;
  zoom = query.has('zoom') ? query.get('zoom') : zoom;

  return (
    <MapContainer style={{ height }} center={center} zoom={zoom} {...otherProps}>
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
  popupContent: DefaultPopupContent
};

export default MapList;
