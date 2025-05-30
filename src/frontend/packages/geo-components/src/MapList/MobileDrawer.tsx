import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useRecordContext } from 'react-admin';
import { Drawer, Box, IconButton, makeStyles } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    zIndex: 1400,
    top: 0,
    right: 0
  }
}));

const MobileDrawer = ({ popupContent, onClose }) => {
  const classes = useStyles();
  const record = useRecordContext();
  const map = useMap();
  useEffect(() => {
    if (record) {
      map.setView([record.latitude, record.longitude]);
    }
  }, [record, map]);

  return (
    <Drawer anchor="bottom" open={!!record} onClose={onClose}>
      <Box p={1} position="relative">
        <IconButton onClick={onClose} className={classes.closeButton} size="large">
          <ClearIcon />
        </IconButton>
        {React.createElement(popupContent)}
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
