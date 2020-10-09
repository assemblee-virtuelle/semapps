import React from 'react';
import { Notification } from 'react-admin';
import { Container, Box, useMediaQuery, ThemeProvider } from '@material-ui/core';
import Header from './Header';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children, theme }) => {
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <Header />
      <Container maxWidth="lg" disableGutters={xs}>
        <Box mb={{ xs: 0, sm: 5 }}>{children}</Box>
      </Container>
      {/* Required for react-admin optimistic update */}
      <Notification />
    </ThemeProvider>
  );
};

export default Layout;
