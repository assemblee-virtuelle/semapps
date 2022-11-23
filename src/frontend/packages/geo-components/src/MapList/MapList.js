import React, { useState } from 'react';
import { useListContext } from 'react-admin';
import { useLocation } from 'react-router';
import { useMediaQuery, Box, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';
import DefaultPopupContent from './DefaultPopupContent';
import QueryStringUpdater from './QueryStringUpdater';
import MobileDrawer from "./MobileDrawer";

const useStyles = makeStyles(() => ({
  loading: {
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const MapList = ({
  latitude,
  longitude,
  label,
  description,
  popupContent,
  height,
  center,
  zoom,
  groupClusters,
  boundToMarkers,
  connectMarkers,
  ...otherProps
}) => {
  const { ids, data, basePath, loading } = useListContext();
  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'), { noSsr: true });
  const [drawerRecord, setDrawerRecord] = useState(null);
  const classes = useStyles();

  // Get the zoom and center from query string, if available
  const query = new URLSearchParams(useLocation().search);
  center = query.has('lat') && query.has('lng') ? [query.get('lat'), query.get('lng')] : center;
  zoom = query.has('zoom') ? query.get('zoom') : zoom;

  let previousRecord;

  const records = ids
    .filter(id => data[id])
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

  const markers = records.map((record, i) => {
    const marker = (
      <React.Fragment key={i}>
        <Marker
          position={[record.latitude, record.longitude]}
          eventHandlers={
            xs
              ? {
                  click: () => setDrawerRecord(record)
                }
              : undefined
          }
        >
          {!xs && <Popup>{React.createElement(popupContent, { record, basePath })}</Popup>}
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
  });

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
      {loading && (
        <Box alignItems="center" className={classes.loading}>
          <CircularProgress size={60} thickness={6} />
        </Box>
      )}
      {groupClusters ? <MarkerClusterGroup showCoverageOnHover={false}>{markers}</MarkerClusterGroup> : markers}
      <QueryStringUpdater />
      <MobileDrawer
        record={drawerRecord}
        basePath={basePath}
        popupContent={popupContent}
        onClose={() => setDrawerRecord(null)}
      />
    </MapContainer>
  );
};

MapList.defaultProps = {
  height: 700,
  center: [47, 2.213749],
  zoom: 6,
  groupClusters: true,
  connectMarkers: false,
  scrollWheelZoom: false,
  popupContent: DefaultPopupContent
};

export default MapList;
