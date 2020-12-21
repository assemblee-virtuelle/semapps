import React from 'react';
import { Notification } from 'react-admin';
import {Container, Box, useMediaQuery, ThemeProvider, makeStyles } from '@material-ui/core';
import AppBar from './AppBar';
import ScrollToTop from './ScrollToTop';

const useStyles = makeStyles(theme => ({
  hero: {
    backgroundImage: `url('${process.env.PUBLIC_URL}/bandeau.jpg')`
  }
}));

const Layout = ({ appBar, logout, theme, children }) => {
  const classes = useStyles();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <Box width={1} height="90px" className={classes.hero}/>
      {React.cloneElement(appBar, { logout })}
      <Container maxWidth="lg" disableGutters={xs}>
        <Box mb={{ xs: 0, sm: 5 }}>{children}</Box>
      </Container>
      {/* Required for react-admin optimistic update */}
      <Notification />
    </ThemeProvider>
  );
};

Layout.defaultProps = {
  appBar: <AppBar />
};

export default Layout;
