import React from 'react';
import { useMap } from 'react-leaflet';

const ChangeView = ({
  center,
  zoom
}: any) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default ChangeView;
