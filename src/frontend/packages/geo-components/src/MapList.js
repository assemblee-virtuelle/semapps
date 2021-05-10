import React from 'react';
import { useListContext } from 'react-admin';
import { useLocation } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import DefaultPopupContent from './DefaultPopupContent';
import QueryStringUpdater from './QueryStringUpdater';

const MapList = ({
  latitude,
  longitude,
  label,
  description,
  popupContent,
  height,
  center,
  zoom,
  boundToMarkers,
  connectMarkers,
  ...otherProps
}) => {
  const { ids, data, basePath } = useListContext();

  // Get the zoom and center from query string, if available
  const query = new URLSearchParams(useLocation().search);
  center = query.has('lat') && query.has('lng') ? [query.get('lat'), query.get('lng')] : center;
  zoom = query.has('zoom') ? query.get('zoom') : zoom;

  let previousRecord;

  const records = ids
    .map(id => ({
      ...data[id],
      latitude: latitude && latitude(data[id]),
      longitude: longitude && longitude(data[id]),
      label: label && label(data[id]),
      description: description && description(data[id])
    }))
    .filter(record => record.latitude && record.longitude);

  const bounds =
    boundToMarkers && records.length > 0 ? records.map(record => [record.latitude, record.longitude]) : undefined;

  // Do not display anything if the bounds are not ready, otherwise the MapContainer will not be initialized correctly
  if (boundToMarkers && !bounds) return null;

  return (
    <MapContainer
      style={{ height }}
      center={!boundToMarkers ? center : undefined}
      zoom={!boundToMarkers ? zoom : undefined}
      bounds={bounds}
      {...otherProps}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup showCoverageOnHover={false}>
        {records.map((record, i) => {
          const marker = (
            <React.Fragment key={i}>
              <Marker position={[record.latitude, record.longitude]}>
                <Popup>{React.createElement(popupContent, { record, basePath })}</Popup>
              </Marker>
              {connectMarkers && previousRecord && (
                <Polyline
                  positions={[
                    [previousRecord.latitude, previousRecord.longitude],
                    [record.latitude, record.longitude]
                  ]}
                />
              )}
            </React.Fragment>
          );

          // Save record so that we can trace lines
          previousRecord = record;

          return marker;
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
  connectMarkers: false,
  scrollWheelZoom: false,
  popupContent: DefaultPopupContent
};

export default MapList;
