import React from 'react';
import { Container, Box } from '@material-ui/core';

const Layout = ({ children }) => (
  <>
    <Box bgcolor="grey.main">
      <Container maxWidth="lg">
        <Box p={3}>
        <img src={ process.env.PUBLIC_URL + "/av-chantiers-collaboratifs.png"} height="125" />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg">
      <Box p={3}>
      {children}
      </Box>
    </Container>
  </>
);

export default Layout;
