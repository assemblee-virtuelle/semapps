import React from 'react';
import { Notification } from 'react-admin';
import { Container, Box, ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

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

const useStyles = makeStyles(() => ({
  header: {
    position: 'relative',
    height: 65,
    marginBottom: 35
  },
  logo: {
    position: 'absolute',
    top: -15,
    height: 110,
    width: 110
  }
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor="primary.main">
        <Container maxWidth="lg" className={classes.header}>
          <Link to="/Project">
            <img
              src={process.env.PUBLIC_URL + '/av.png'}
              alt="Assemblée Virtuelle"
              className={classes.logo}
            />
          </Link>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <Box mb={5}>{children}</Box>
      </Container>
      <Notification />
    </ThemeProvider>
  );
}

export default Layout;
