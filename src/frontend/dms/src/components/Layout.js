import React from 'react';
import { Notification } from 'react-admin';
import { Container, Box, ThemeProvider, createMuiTheme } from '@material-ui/core';
import Header from './Header';

const theme = createMuiTheme({
  palette: {
    grey: { main: '#e0e0e0' },
    primary: { main: '#28ccfb' }
  },
  typography: {
    details: {
      fontSize: 8
    }
  },
  overrides: {
    RaChipField: {
      chip: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 8,
        marginBottom: 8
      }
    },
    RaShow: {
      card: {
        padding: 25
      }
    },
    RaSingleFieldList: {
      root: {
        marginTop: 0,
        marginBottom: 0
      }
    }
  }
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Header/>
      <Container maxWidth="lg">
        <Box mb={5}>{children}</Box>
      </Container>
      <Notification />
    </ThemeProvider>
  );
}

export default Layout;
