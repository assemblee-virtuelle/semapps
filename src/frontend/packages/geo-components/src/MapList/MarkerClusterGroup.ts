import L from 'leaflet';
import { createPathComponent } from '@react-leaflet/core';
import 'leaflet.markercluster';

// Taken from https://github.com/changey/react-leaflet-markercluster/blob/60992857087c181ada1e8e6659a6666a13c1f868/src/react-leaflet-markercluster.js
function createMarkerCluster({ children: _c, ...props }, context) {
  const clusterProps = {};
  const clusterEvents = {};
  // Splitting props and events to different objects
  Object.entries(props).forEach(([propName, prop]) =>
    propName.startsWith('on') ? (clusterEvents[propName] = prop) : (clusterProps[propName] = prop)
  );

  const instance = new L.MarkerClusterGroup(clusterProps);

  // Initializing event listeners
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    instance.on(clusterEvent, callback);
  });
  return {
    instance,
    context: {
      ...context,
      layerContainer: instance
    }
  };
}

const MarkerClusterGroup = createPathComponent(createMarkerCluster);

export default MarkerClusterGroup;
