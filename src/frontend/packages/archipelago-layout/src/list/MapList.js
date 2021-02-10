import React from 'react';
import { useListContext, ShowButton, EditButton, useResourceDefinition } from 'react-admin';
import { Typography } from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const PopupContent = ({ record, basePath }) => {
  const resourceDefinition = useResourceDefinition({});
  return (
    <>
      {record.label && <Typography variant="h5">{record.label}</Typography>}
      {record.description && <Typography>{record.description.length > 150 ? record.description.substring(0, 150) + '...' : record.description}</Typography>}
      {resourceDefinition.hasShow && <ShowButton basePath={basePath} record={record} />}
      {resourceDefinition.hasEdit && <EditButton basePath={basePath} record={record} />}
    </>
  );
}

const MapList = ({ latitude, longitude, label, description, popupContent, ...otherProps }) => {
  const { ids, data, basePath } = useListContext();
  return (
    <MapContainer style={{ height: 700 }} {...otherProps} >
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
        if( record.latitude && record.longitude ) {
          return (
            <Marker key={id} position={[record.latitude, record.longitude]}>
              <Popup>
                {React.createElement(popupContent, { record, basePath })}
              </Popup>
            </Marker>
          );
        } else {
          return null;
        }
      })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

MapList.defaultProps = {
  height: 700,
  center: [47, 2.213749],
  zoom: 6,
  scrollWheelZoom: false,
  popupContent: PopupContent,
}

export default MapList;
