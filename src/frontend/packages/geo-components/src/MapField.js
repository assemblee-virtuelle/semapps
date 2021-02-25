import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  address: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
}));

const MapField = ({ record, latitude, longitude, address, height, addLabel, ...otherProps }) => {
  const classes = useStyles();

  // Do not display the component if it has no latitude or longitude
  const position = [latitude(record), longitude(record)];
  if (!position[0] || !position[1]) return null;

  return (
    <Box addLabel={addLabel}>
      {address && (<Typography className={classes.address}>{address(record)}</Typography>)}
      <MapContainer style={{ height }} center={position} {...otherProps}>
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
