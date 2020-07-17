import React from 'react';
import { Container, Box, Typography } from '@material-ui/core';

const Layout = ({ children }) => (
  <>
    <Box bgcolor="grey.main">
      <Container maxWidth="lg">
        <Box pb={3} pt={3}>
          <img src={process.env.PUBLIC_URL + '/av-chantiers-collaboratifs.png'} height="125" />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg">
      <Box>{children}</Box>
    </Container>
  </>
);

export default Layout;
