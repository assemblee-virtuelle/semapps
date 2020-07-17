import React from 'react';
import { Container, Box } from '@material-ui/core';

const Layout = ({ children }) => (
  <>
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
      <Box>{children}</Box>
    </Container>
  </>
);

export default Layout;
