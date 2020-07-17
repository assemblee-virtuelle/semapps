import React from 'react';
import { Container, Box, Typography } from '@material-ui/core';

const Layout = ({ children }) => (
  <>
    <Box bgcolor="grey.main">
      <Container maxWidth="lg">
        <Box p={3}>
          <img src={process.env.PUBLIC_URL + '/av-chantiers-collaboratifs.png'} height="125" />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg">
      <Box p={3}>
        <Typography variant="h6" color="inherit" id="react-admin-title" />
        {children}
      </Box>
    </Container>
  </>
);

export default Layout;
