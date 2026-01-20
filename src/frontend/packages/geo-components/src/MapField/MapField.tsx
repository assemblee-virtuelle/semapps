import React from 'react';
import { useRecordContext } from 'react-admin';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import ChangeView from './ChangeView';

const MapField = ({
  latitude,
  longitude,
  address,
  height = 400,
  zoom = 11,
  typographyProps,
  ...rest
}: any) => {
  const record = useRecordContext();
  const position = [latitude(record), longitude(record)];

  // Do not display the component if it has no latitude or longitude

  if (!position[0] || !position[1]) return null;

  return (
    <Box>
      {address && (
        <Box mt={1} mb={1}>
          <Typography {...typographyProps}>{address(record)}</Typography>
        </Box>
      )}
      <MapContainer style={{ height }} center={position} zoom={zoom} {...rest}>
        <ChangeView center={position} />
        <TileLayer
          // @ts-expect-error TS(2322): Type '{ attribution: string; url: string; }' is no... Remove this comment to see the full error message
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </Box>
  );
};

export default MapField;
