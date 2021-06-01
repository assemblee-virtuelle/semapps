import React from 'react';
import { AppBar as RaAppBar, Link } from 'react-admin';
import { Zoom, Hidden, makeStyles } from '@material-ui/core';
import SearchForm from '../SearchForm';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles(theme => ({
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: {
    height: 56,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '24px'
    }
  },
  spacer: {
    flex: 1
  },
  searchFormContainer: {
    minWidth: 240,
    flex: 2,
    margin: '0 5%',
    [theme.breakpoints.up('md')]: {
      minWidth: 360
    }
  },
  searchFormWrapper: {
    maxWidth: 880,
    margin: 'auto'
  },
  presContainer: {
    flex: 1,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      flex: 'unset',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  },
  logoContainer: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      height: 48,
      marginLeft: '0.2em',
      marginRight: '0.2em',
      display: 'block'
    }
  },
  logo: {
    height: '100%'
  },
  title: {
    display: 'block',
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      display: 'block'
    }
  }
}));

const AppBar = props => {
  const classes = useStyles();
  return (
    <RaAppBar
      {...props}
      classes={{ toolbar: classes.toolbar, menuButton: classes.menuButton, ...props.classes }}
      color="primary"
    >
      <Link to="/">
        <div className={classes.presContainer}>
          <div className={classes.logoContainer}>
            <Zoom in={true} timeout={2000}>
              <img className={classes.logo} src={process.env.PUBLIC_URL + '/logo192.png'} alt="logo" />
            </Zoom>
          </div>
          <Typography className={classes.title} variant="h6" noWrap>
            {props.title}
          </Typography>
        </div>
      </Link>
      <Hidden only="xs">
        <div className={classes.searchFormContainer}>
          <div className={classes.searchFormWrapper}>
            <SearchForm />
          </div>
        </div>
      </Hidden>
    </RaAppBar>
  );
};

export default AppBar;
