import React, { useState } from 'react';
import { useListContext, RecordContextProvider } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { useMediaQuery, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';
import DefaultPopupContent from './DefaultPopupContent';
import QueryStringUpdater from './QueryStringUpdater';
import MobileDrawer from './MobileDrawer';

const useStyles = makeStyles(() => ({
  isLoading: {
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
  popupContent = DefaultPopupContent,
  height = 700,
  center = [47, 2.213749],
  zoom = 6,
  groupClusters = true,
  boundToMarkers,
  connectMarkers = false,
  scrollWheelZoom = false,
  ...otherProps
}) => {
  const { data, isLoading } = useListContext();
  const xs = useMediaQuery(theme => theme.breakpoints.down('sm'), { noSsr: true });
  const [drawerRecord, setDrawerRecord] = useState(null);
  const classes = useStyles();

  // Get the zoom and center from query string, if available
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  center = query.has('lat') && query.has('lng') ? [query.get('lat'), query.get('lng')] : center;
  zoom = query.has('zoom') ? query.get('zoom') : zoom;

  let previousRecord;

  const records = isLoading
    ? []
    : data
        .map(record => ({
          ...record,
          latitude: latitude && latitude(record),
          longitude: longitude && longitude(record),
          label: label && label(record),
          description: description && description(record)
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
          {!xs && (
            <Popup>
              <RecordContextProvider value={record}>{React.createElement(popupContent)}</RecordContextProvider>
            </Popup>
          )}
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
      scrollWheelZoom={scrollWheelZoom}
      {...otherProps}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isLoading && (
        <Box alignItems="center" className={classes.isLoading}>
          <CircularProgress size={60} thickness={6} />
        </Box>
      )}
      {groupClusters ? <MarkerClusterGroup showCoverageOnHover={false}>{markers}</MarkerClusterGroup> : markers}
      <QueryStringUpdater />
      <RecordContextProvider value={drawerRecord}>
        <MobileDrawer popupContent={popupContent} onClose={() => setDrawerRecord(null)} />
      </RecordContextProvider>
    </MapContainer>
  );
};

export default MapList;
