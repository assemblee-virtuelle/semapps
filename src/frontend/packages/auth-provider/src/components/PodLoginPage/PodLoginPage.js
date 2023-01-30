import React, { useMemo } from 'react';
import { Notification } from 'react-admin';
import { createTheme, ThemeProvider } from '@material-ui/core';
import PodLoginPageView from "./PodLoginPageView";

const PodLoginPage = (props) => {
  const muiTheme = useMemo(() => createTheme(props.theme), [props.theme]);
  return (
    <ThemeProvider theme={muiTheme}>
      <PodLoginPageView {...props} />
      <Notification />
    </ThemeProvider >
  );
};

export default PodLoginPage;
