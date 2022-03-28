import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Box, Typography } from '@material-ui/core';
import ChangeView from './ChangeView';

const MapField = ({ record, latitude, longitude, address, height, addLabel, typographyProps, ...rest }) => {
  // Do not display the component if it has no latitude or longitude
  const position = [latitude(record), longitude(record)];
  if (!position[0] || !position[1]) return null;

  return (
    <Box>
      {address && (
        <Box mt={1} mb={1}>
          <Typography {...typographyProps}>{address(record)}</Typography>
        </Box>
      )}
      <MapContainer style={{ height }} center={position} {...rest}>
        <ChangeView center={position} /> 
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </Box>
  );
};

MapField.defaultProps = {
  height: 400,
  zoom: 11,
  addLabel: true
};

export default MapField;
