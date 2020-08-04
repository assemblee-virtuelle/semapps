import React from 'react';
import { Notification } from 'react-admin';
import { Container, Box, ThemeProvider, createMuiTheme } from '@material-ui/core';
import Header from './Header';
import ScrollToTop from './ScrollToTop';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#28ccfb' },
    secondary: { main: '#bcef5b' },
    grey: { main: '#e0e0e0' },
    lightGrey: { main: '#e0e0e0' }
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
      <ScrollToTop />
      <Header />
      <Container maxWidth="lg">
        <Box mb={5}>{children}</Box>
      </Container>
      <Notification />
    </ThemeProvider>
  );
};

export default Layout;
