import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Drawer, Box, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    zIndex: 1400,
    top: 0,
    right: 0
  }
}));

const MobileDrawer = ({ record, basePath, popupContent, onClose }) => {
  const classes = useStyles();
  const map = useMap();
  useEffect(() => {
    if (record) {
      map.setView([record.latitude, record.longitude]);
    }
  }, [record, map]);

  return (
    <Drawer anchor="bottom" open={!!record} onClose={onClose}>
      <Box p={1} position="relative">
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
        {record && React.createElement(popupContent, { record, basePath })}
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
