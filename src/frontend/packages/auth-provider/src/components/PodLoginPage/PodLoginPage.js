import React from 'react';
import { Notification, useTheme } from 'react-admin';
import { ThemeProvider } from '@mui/system';
import { StyledEngineProvider } from '@mui/material';
import PodLoginPageView from './PodLoginPageView';

const PodLoginPage = props => {
  const [theme] = useTheme();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <PodLoginPageView {...props} />
        <Notification />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default PodLoginPage;
