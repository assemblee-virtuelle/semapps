import React from 'react';
import { useListContext, Link } from 'react-admin';
import { Button, Typography } from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const MapList = ({ latitude, longitude, label, description, linkType, ...otherProps }) => {
  const { ids, data, basePath } = useListContext();
  return (
    <MapContainer style={{ height: 700 }} {...otherProps} >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup showCoverageOnHover={false}>
      {ids.map(id => {
        const recordLatitude = latitude && latitude(data[id]);
        const recordLongitude = longitude && longitude(data[id]);
        const recordLabel = label && label(data[id]);

        let recordDescription = description && description(data[id]);
        if (recordDescription && recordDescription.length > 150) recordDescription = recordDescription.substring(0, 150) + '...'

        let recordLink = `${basePath}/${encodeURIComponent(id)}`;
        if (linkType === 'show') recordLink += '/show';

        // Display a marker only if there is a latitude and longitude
        if( recordLatitude && recordLongitude ) {
          return (
            <Marker key={id} position={[recordLatitude, recordLongitude]}>
              <Popup>
                {recordLabel && <Typography variant="h5">{recordLabel}</Typography>}
                {recordDescription && <Typography>{recordDescription}</Typography>}
                <Link to={recordLink}>
                  <Button color="primary" variant="contained">Voir</Button>
                </Link>
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
  linkType: 'edit',
  height: 700,
  center: [47, 2.213749],
  zoom: 6,
  scrollWheelZoom: false
}

export default MapList;
