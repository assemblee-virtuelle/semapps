import * as React from 'react';
import { Loading } from 'react-admin';
import { defaultTheme } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const LoggingOut = ({ theme }) => {
  return (
    <ThemeProvider theme={createMuiTheme(defaultTheme)}>
      <Loading />
    </ThemeProvider>
  );
};

export default LoggingOut;
