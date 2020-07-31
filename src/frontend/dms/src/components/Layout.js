import React from 'react';
import { Notification } from 'react-admin';
import { Container, Box, ThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    grey: { main: '#e0e0e0' },
    primary: { main: '#61d2fe' }
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
    }
  }
});

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Box bgcolor="grey.main">
      <Container maxWidth="lg">
        <Box pb={3} pt={3}>
          <img
            src={process.env.PUBLIC_URL + '/av-chantiers-collaboratifs.png'}
            style={{ maxHeight: 125, maxWidth: '100%' }}
            alt="Chantiers collaboratifs"
          />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg">
      <Box mb={5}>{children}</Box>
    </Container>
    <Notification/>
  </ThemeProvider>
);

export default Layout;
