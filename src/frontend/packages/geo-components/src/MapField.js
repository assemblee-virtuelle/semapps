import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box } from '@material-ui/core';

const MapField = ({ record, latitude, longitude, height, ...otherProps }) => {
  const position = [latitude(record), longitude(record)];

  // Do not display the component if it has no latitude or longitude
  if (!position[0] || !position[1]) return null;

  return (
    <MapContainer style={{ height }} center={position} {...otherProps}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
    </MapContainer>
  );
};

MapField.defaultProps = {
  height: 400,
  zoom: 11,
  addLabel: true
};

export default MapField;
