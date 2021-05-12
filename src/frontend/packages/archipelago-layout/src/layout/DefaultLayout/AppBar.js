import React from 'react';
import { AppBar as RaAppBar } from 'react-admin';
import { Zoom, Hidden, makeStyles } from '@material-ui/core';
import SearchForm from '../SearchForm';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  toolbar: {
    height: 56
  },
  spacer: {
    flex: 1
  },
  searchForm: {
    flex: 2
  },
  presContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoContainer: {
    minWidth: 56,
    height: 56,
    marginRight: 8,
  },
  logo: {
    height: '100%',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
}));

const AppBar = props => {
  const classes = useStyles();
  return (
    <RaAppBar {...props} classes={{ toolbar: classes.toolbar, ...props.classes }} color="primary">
      <span className={classes.spacer} >
        <div className={classes.presContainer}>
            <div className={classes.logoContainer}>
                <Zoom in={true} timeout={2000}>
                    <img 
                        className={classes.logo}
                        src={process.env.PUBLIC_URL + '/logo192.png'}
                        alt="logo"
                    />
                </Zoom>
            </div>
            <Typography
                className={classes.title}
                variant="h6"
                noWrap
            >
                { props.title }
            </Typography>
        </div> 
      </span>
      <Hidden only="xs">
        <span className={classes.searchForm}>
          <SearchForm />
        </span>
      </Hidden>
      <span className={classes.spacer} />
    </RaAppBar>
  );
};

export default AppBar;
